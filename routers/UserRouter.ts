import express, { Router } from "express";
import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";
import { getCollections, UsersDb } from "../database/UsersDb";
import { addTest } from "../UserData";
import { getUniqueFilename } from "../utils";
import multer from "multer";
import fs, { rm } from "fs";
import path from "path";
import PhotoModel from "../models/PhotoModel";
import { PhotosDb } from "../database/photosDb";
import bodyParser from "body-parser";
import imageToBase64 from "image-to-base64";
import { getDb } from "../database/MongoDb";
import { Collection } from "mongoose";

const usersRouter = Router();

const storage = multer.diskStorage({
    destination: "Public/Uploads/",
    filename: (req, file, cb) => {
        cb(null, getUniqueFilename(file.originalname));
    },
});

const upload = multer({ storage: storage });

// GET ONE USER BY USERNAME
usersRouter.get("/:name", async (req, res) => {
    const username = req.params.name;

    const result = await UsersDb.getUserByUsername(username);

    if (result) res.status(200).send(result);
});

// GET ALL USERS
usersRouter.get("/all", async (req, res) => {
    const result = await UsersDb.getUsers();

    if (result) res.status(200).send(result);
});

// GET ALL PHOTOS
usersRouter.get("/photos", async (req, res) => {
    const result = await PhotosDb.getPhotos();

    if (result) res.status(200).send(result);
});

// UPDATE USER BY ID
usersRouter.put("/:id", async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const data = req.body;

    const result = await UsersDb.updateUser(userId, data);

    if (result) res.status(200).send(result);
});

// UPDATE USER-ROLE BY ID
usersRouter.put("/:id/role", async (req, res) => {
    const userId = new ObjectId(req.params.id);

    const currentRole = req.body.isAdmin;

    const newRole = currentRole === 0 ? 1 : 0;

    const result = await UsersDb.changeRole(userId, newRole);

    if (result) {
        console.log(result);
        res.status(200).send(result);
    }
});

// DELETE PHOTO BY ID
usersRouter.delete("/photos/:id", async (req, res) => {
    const photoId = new ObjectId(req.params.id);

    try {
        const result = await PhotosDb.deleteImageById(photoId).then(() => {
            console.log(result);
            res.status(200);
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE USER BY ID
usersRouter.delete("/:username", async (req, res) => {
    const userName = req.params.username;

    try {
        const result = await UsersDb.removeUser(userName).then(() => {
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

//  GET ONE USERS PHOTOS
usersRouter.get("/photos/:name", async (req, res) => {
    const result = await PhotosDb.getPhotosByUser(req.params.name);

    if (result) {
        res.status(200).send(result);
    }
});

// UPLOAD NEW PHOTO
usersRouter.post("/upload", upload.single("image"), async (req, res) => {
    const image = req.file;

    if (image) {
        const upload_img: PhotoModel = {
            username: req.body.username,
            filename: image.filename,
            title: req.body.title,
            img: {
                data: fs.readFileSync("Public/Uploads/" + image.filename),
                contentType: image.mimetype,
            },
        };

        const result = await PhotosDb.addPhoto(upload_img);

        fs.rm(
            "Public/Uploads/" + image.filename,
            { recursive: true },
            (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            }
        );

        res.status(200).send("file uploaded successfully");
    }
});

export default usersRouter;
