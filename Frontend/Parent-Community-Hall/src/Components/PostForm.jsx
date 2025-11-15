import { useRef, useState } from 'react'
import { TextField, Button, IconButton,  Typography } from '@mui/material'
import { CloseOutlined,  Image, Send } from '@mui/icons-material'

const PostForm = ({ server, showPostForm, setName }) => {
    const inputTag = useRef()
    const [image, setImage] = useState(null)
    const [tweet, setTweet] = useState('')
    const [loading,setLoading] = useState(false)
    const [wroteName,setWroteName] = useState(null)
    const name = localStorage.getItem('parentName')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!tweet.trim()) {
            alert('Please enter your tweet content')
            return
        }

        try {
            let formData = new FormData()
            formData.append("author", (name || wroteName))
            formData.append("message", tweet)
            formData.append("manualName",(name?false:true))
            if (image)
                formData.append("postPic", image)

            let response = await server.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            alert(response.data.message)

            if (response.status === 200) {
                setImage(null)
                setTweet('')
                showPostForm(false)
                if(response.data.token){
                    localStorage.setItem("pchToken",response.data.token)
                    localStorage.setItem("parentName",wroteName)
                    setName(wroteName)
                }
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to post tweet')
        }
        setLoading(false)
    }
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form 
                className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-2xl rounded-2xl flex flex-col gap-6 w-full max-w-md p-8 border border-white/50"
                onSubmit={handleSubmit}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <Typography variant="h5" className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create Post
                    </Typography>
                    <IconButton 
                        onClick={() => showPostForm(false)}
                        className="hover:bg-red-50 transition-colors"
                    >
                        <CloseOutlined className="text-gray-600 hover:text-red-500 transition-colors" />
                    </IconButton>
                </div>

                {/* Name Field */}
                <TextField 
                    label="Your Name" 
                    value={name}
                    variant="outlined"
                    fullWidth
                    size="small"
                    disabled ={name!==null}
                    className="bg-white/80 rounded-lg"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                        }
                    }}
                    onChange={(e)=>setWroteName(e.target.value)}
                />

                {/* Tweet Textarea */}
                <div className="relative">
                    <textarea 
                        name="tweet" 
                        id="tweet" 
                        value={tweet}
                        placeholder="What's on your mind?... ✨"
                        onChange={e => setTweet(e.target.value)}
                        className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 transition-all placeholder:text-gray-400 text-gray-700"
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                        {tweet.length}/280
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
                     onClick={() => inputTag.current?.click()}
                >
                    {image ? (
                        <div className="space-y-3">
                            <img 
                                src={URL.createObjectURL(image)} 
                                alt="preview" 
                                className="max-h-48 max-w-full rounded-xl mx-auto shadow-md object-cover"
                            />
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setImage(null)
                                }}
                                className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                                Remove Image
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <Image className="text-blue-500" />
                            </div>
                            <Typography className="text-gray-600">
                                <span className="text-blue-500 font-semibold">Click to upload</span> or drag and drop
                            </Typography>
                            <Typography variant="caption" className="text-gray-400">
                                PNG, JPG, GIF up to 10MB
                            </Typography>
                        </div>
                    )}
                </div>

                {/* Hidden File Input */}
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    ref={inputTag} 
                    name="postImg" 
                    id="postImg" 
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                {/* Submit Button */}
                <Button 
                    variant="contained" 
                    type="submit"
                    disabled={!tweet.trim() || loading}
                    className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    startIcon={<Send />}
                >
                    {loading?'Processing..':'Post Tweet'}
                </Button>

                {/* Footer Note */}
                <Typography variant="caption" className="text-center text-gray-400 mt-2">
                    Your post will be visible to everyone
                </Typography>
            </form>
        </div>
    )
}

export default PostForm