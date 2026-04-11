import  {ImageKit}  from "@imagekit/nodejs/client.js";

const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imageKit