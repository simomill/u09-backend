import express, { Router } from "express";
import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";
import { UsersDb } from "../database/UsersDb";
import { addTest } from "../UserData";
import { getUniqueFilename } from "../utils";
import multer from "multer";
import fs, { rm } from "fs";
import path from "path";
import PhotoModel from "../models/PhotoModel";
import { PhotosDb } from "../database/photosDb";
import bodyParser from "body-parser";
import imageToBase64 from 'image-to-base64';

const usersRouter = Router();


const storage = multer.diskStorage({
    destination: "Public/Uploads/",
    filename: (req, file, cb) => {
        cb(null, getUniqueFilename(file.originalname))
    }
});

const upload = multer({ storage: storage });

// get all users
usersRouter.get("/", async (req, res) => {
    const result = await UsersDb.getUsers();

    res.send(result);
});

// get one user
usersRouter.get("/:name", async (req, res) => {
    const username = req.params.name;

    const result = await UsersDb.getUserByUsername(username);

    res.send(result);
});

usersRouter.get("/photos/:name", async (req, res) => {
    const result = await PhotosDb.getPhotosByUser(req.params.name);

    res.send(result);
})

usersRouter.post("/upload", upload.single("image"), (req, res) => {
    // const img = fs.readFileSync(req.file.path);
    const image = req.file;    
    res.send(image)
    if (image) {
        
        const upload_img: PhotoModel = {
        username: req.body.username,
        filename: image.filename,
        title: req.body.title,
            img: {
                data: fs.readFileSync('Public/Uploads/' + image.filename),
                contentType: image.mimetype
            }
        }

        
        PhotosDb.addPhoto(upload_img)

        fs.rm('Public/Uploads/' + image.filename, { recursive: true }, (err) => {
            if (err) {
                console.log(err.message);
                return; 
            }
            console.log("file deleted successfully");
        }) 
    }  
});


export default usersRouter;
