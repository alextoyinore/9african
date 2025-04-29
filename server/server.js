import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import User from './Schema/User.js'
import Blog from './Schema/Blog.js'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import serviceAccountKey from './african-c3658-firebase-adminsdk-fbsvc-f2efe7cd2b.json' with {type:'json'} 
import { emailRegex, passwordRegex } from './regex.js'
import aws from 'aws-sdk'
import { upload } from './config/multer.js'
import { uploadImageToCloudinary } from './config/cloudinary.js'
import imageAsDataURL from './config/imageAsDataUrl.js'


const server = express()
server.use(express.json())
server.use(cors())

/**
 * Initialize firebase admin
 */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
    dbName: '9african'
}

/**
 * MongoDB Connection
 */
try{
    mongoose.connect(process.env.DB_CONNECTION_STRING, clientOptions, {
        autoIndex: true,
    })
} catch (error) {
    console.error('Error occured while attempting to connect to mongodb', error.message);
    throw error;
}

/**
 * Set up S3 bucket
 */
const s3 = new aws.S3({
    region: 'eu-west-3',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

/**
 * Format data to send to frontend
 * @param {*} user 
 * @returns 
 */
const formatDataToSend = (user) => {

    const access_token = jwt.sign(
        {id: user._id},
        process.env.SECRET_KEY
    )

    return {
        token: access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

/**
 * Generate Username by checkcing the username first
 * @param {*} email 
 * @returns 
 */
const generateUsername = async (email) => {
    let username = email.split('@')[0]
    // Check database for username record
    const usernameExists = await User.exists({
        "personal_info.username": username
    }).then(result => result)

    usernameExists ? username += nanoid().substring(0, 3) : null

    return username
}

/*
* Generate Upload URL
*/
const generateUploadURL = async () => {
    const date = new Date()
    const  imageName = `${nanoid()}-${date.getTime()}.jpeg`    
    return await s3.getSignedUrlPromise('putObject', {
        Bucket: '9african',
        Key: imageName,
        Expires: 1000,
        ContentType: 'image/jpeg'
    })
}

/**
 * Get Upload URL
 */
server.get('/get-upload-url', (req, res) => {
    generateUploadURL()
    .then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ 'error': err.message })
    })
})

/**
 * Upload image to cloudinary and return url
 */
server.post("/get-image-url", upload.single('file'), async (req, res) => {
    try {

        let image = req.file

        // Validate file size (e.g., max 10MB)
        const maxSize = 1 * 1024 * 1024; // 1MB in bytes
        if (image.size > maxSize) {
            return res.status(403).json({'error': `Image file size exceeds max size of ${maxSize}MB limit.`});
        }
    
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;

        const url = await uploadImageToCloudinary(dataURI);

        return res.status(200).json({url});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
        });
    }
  });


/**
 * Create new User in the database
 */
server.post('/signup', (req, res) => {
    const {fullname, email, password} = req.body
    // validate data from frontend
    if(fullname.length < 3) {
        return res.status(403).json({'error': 'Your full name cannot be less than 3 letters'})
    }

    if(!email.length) {
        return res.status(403).json({'error': 'Email field cannot be empty'})
    }

    if(!emailRegex.test(email)) {
        return res.status(403).json({'error': 'Please enter a valid email address'})
    }

    if(!passwordRegex.test(password)) {
        return res.status(403).json({'error': 'Your password should be between 6 to 20 characters long. Should contain at least 1 lowercase and 1 uppercase letter, should contain at least one special character and should contain numeric characters.'})
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        const username = await generateUsername(email)
        const user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password,
                username
            }
        })
        user.save().then((data)=>{
            return res.status(200).json({user: formatDataToSend(data)})
        }).catch(err => {
            if(err.code == 11000){
                return res.status(500).json({'error': 'The email you are attempting to register is already registered by another user'})
            }
            return res.status(500).json({'error': err.message})
        })
    })
})


/**
 * Sign in
 */

server.post('/signin', (req, res) => {
    const {email, password} = req.body

    User.findOne({'personal_info.email': email})
    .then(user => {

        if(!user) {
            return res.status(403).json({'error': 'Email not found'})
        }

        if(!user.google_auth){
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if(err) {
                    return res.status(403).json({'error': 'Error occured during sign in, please try again.'}) 
                }
    
                if(!result){
                    return res.status(403).json({'error': 'Incorrect password'})
                }else {
                    return res.status(200).json(formatDataToSend(user))
                }
            })
    
        } else {
            return res.status(403).json({'error': 'This account was created using google auth. Signing in with "Continue with Google"'})
        }
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({'error': err.message})
    })
})

/**
 * Google Auth
 */
server.post('/google-auth', async (req, res) => {
    const { access_token } = req.body
    getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
        console.log(decodedUser);

        let { email, name, picture } = decodedUser
        
        // save high res picture
        picture = picture.replace('s96-c', 's384-c')
        
        // Check if user exists. If user exists return user for sign in
        let user = await User.findOne({'personal_info.email': email}).select('personal_info.fullname personal_info.username personal_info.profile_img google_auth').then((u) => {
            return u || null
        }).catch(err => {
            return res.status(500).json({'error': err.message})
        })

        /**
         * login user if the user exists
         */
        if(user) {
            if(!user.google_auth) {
                return res.status(403).json({'error': 'This email was not signed up with google. Please use the email/password option to sign in to your account.'})
            }
        } else {
            // Sign up
            let username = await generateUsername(email)

            user = new User({
                personal_info: {
                    fullname: name,
                    email,
                    profile_img: picture,
                    username,
                },
                google_auth: true
            })
            await user.save().then((u) => {
                user = u
            }).catch(err => {
                return res.status(500).json({'error': err.message})
            })
        }
        return res.status(200).json(formatDataToSend(user))
    }).catch(err => {
        return res.status(500).json({'error': 'Failed to authenticate with google. Try again with another google account'})
    })
})

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token == null) {
        return res.status(401).json({'error': 'Access token required'})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err) {
            return res.status(403).json({'error': 'Access token is invalid'})
        }

        req.user = user.id
        next()
    })
}

server.post('/create-blog', verifyJWT, (req, res) => {
    const authorId = req.user
    const characterLimit = 400

    let { title, banner, des, tags, content, draft } = req.body

    if (!title.length) {
        return res.status(403).json({'error': 'Your post needs a title'})
    }

    if(!draft) {
        if (!des.length || des.length > characterLimit) {
            return res.status(403).json({'error': 'Your post needs a description'})
        }
    
        if (!banner.length) {
            return res.status(403).json({'error': 'Your post needs a banner'})
        }
    
        if (!content.blocks.length) {
            return res.status(403).json({'error': 'Your post needs some content'})
        }
    
        if (!tags.length || tags.length > 15) {
            return res.status(403).json({'error': 'Your post needs some tags or you\'re attempting to add more than 10 tags'})
        }
    }

    tags = tags.map(tag => tag.toLowerCase())

    const blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid()

    const  blog = new Blog({
        blog_id, title, des, banner, content, tags, author: authorId, draft: Boolean(draft)
    })

    blog.save()
    .then(blog => {
        let incrementVal = draft ? 0 : 1

        User.findOneAndUpdate({_id: authorId}, {
            $inc: {
                "account_info.total_posts": incrementVal
            },
            $push: {
                "blogs": blog._id
            }
        })  .then(user => {
            return res.status(200).json({id: blog.blog_id})
        }).catch(err => {
            return res.status(500).json({'error': 'An error occured while updating user records with post details'})
        })
    }).catch(err => {
        return res.status(500).json({'error': err.message})
    })
    
})


server.post('/latest-blogs', async (req, res) => {
    const maxLimit = 5

    let { page } = req.body

    await Blog.find({draft:false})
    .populate('author', 'personal_info.username personal_info.fullname personal_info.profile_img -_id')
    .sort({publishedAt: -1})
    .select('blog_id title des banner activity tags publishedAt -_id')
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })
})

server.post('/all-blog-count', (req, res) => {

    Blog.countDocuments({ draft: false }).
    then(count => {
        return res.status(200).json({totalDocs: count})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })
})

server.get('/trending-blogs', async (req, res) => {
    const maxLimit = 5

    await Blog.find({draft:false})
    .populate('author', 'personal_info.username personal_info.fullname personal_info.profile_img -_id')
    .sort({'activity.total_reads': -1, 'activity.total_likes': -1, publishedAt: -1})
    .select('blog_id title des banner activity tags publishedAt -_id')
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })
})


server.get('/get-popular-tags', async (req, res) => {
    try {
        const tags = await Blog.aggregate([
            { $match: { draft: false } }, // Match only non-draft blogs
            { $unwind: '$tags' }, // Unwind the tags array to create a document for each tag
            { $group: { _id: '$tags', count: { $sum: 1 } } }, // Group by tag and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order
            { $limit: 20 } // Limit to the top 20 tags
        ]);

        return res.status(200).json({ tags: tags.map(tag => tag._id) }); // Return only the tag names
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


server.post('/search-users', async (req, res) => {
    let { query } = req.body

    await User.find({
        'personal_info.username': new RegExp(query, 'i'),
        'personal_info.fullname': new RegExp(query, 'i')
    })
    .select(
        'personal_info.username personal_info.fullname personal_info.profile_img -_id'
    )
    .limit(20)
    .then(users => {
        return res.status(200).json({users})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })

})


server.post('/search-blogs', async (req, res) => {

    let { query, author, topic, page, limit, subtract } = req.body

    let maxLimit = limit ? limit : 5

    let findQuery;

    if(topic) {
        findQuery = { tags: { $regex: topic, $options: 'i' }, draft: false, blog_id: { $ne: subtract } }
    } else if (query) {
        findQuery = { title: { $regex: query, $options: 'i' }, draft: false }
    } else if (author) {
        findQuery = { author, draft: false }
    }

    await Blog.find(findQuery)
    .populate('author', 'personal_info.username personal_info.fullname personal_info.profile_img -_id')
    .sort({publishedAt: -1})
    .select('blog_id title des banner activity tags publishedAt -_id')
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })
})


server.post('/topic-blogs-count', (req, res) => {

    let { topic } = req.body

    Blog.countDocuments({ draft: false, tags: topic }).
    then(count => {
        return res.status(200).json({totalDocs: count})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })
})

server.post('/search-blogs-count', (req, res) => {

    let { query, author } = req.body

    let findQuery;

    if (query) {
        findQuery = { title: { $regex: query, $options: 'i' }, draft: false }
    } else if (author) {
        findQuery = { author, draft: false }
    }

    Blog.countDocuments(findQuery).
    then(count => {
        return res.status(200).json({totalDocs: count})
    })
    .catch(err => {
        return res.status(500).json({error: err.message})
    })
})

server.post('/get-profile', async (req, res) => {
    let { username } = req.body

    await User.findOne({'personal_info.username': username})
    .select('-personal_info.password -google_auth -updatedAt -blogs')
    .then(user => {
        return res.status(200).json(user)
    })
    .catch(err => {
        return res.status(500).json({'error': err.message})
    })
})

server.post('/get-blog', async (req, res) => {
    let { blog_id } = req.body

    let incrementVal = 1

    await Blog.findOneAndUpdate({blog_id}, { $inc: {'activity.total_reads': incrementVal}})
    .populate('author', 'personal_info.fullname personal_info.username personal_info.profile_img personal_info.bio social_links')
    .select('title des content banner activity publishedAt blog_id tags')
    .then(blog => {

        User.findOneAndUpdate({'personal_info.username': blog.author.personal_info.username}, {$inc : {'account_info.total_reads': incrementVal}})
        .catch(err => {
            return res.status(500).json({'error': err.message})
        })

        return res.status(200).json({blog})
    })
    .catch(err => {
        return res.status(500).json({'error': err.message})
    })

})

const PORT = 3000

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

