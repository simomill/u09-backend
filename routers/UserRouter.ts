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
import imageToBase64 from "image-to-base64";
import { getDb } from "../database/MongoDb";

const usersRouter = Router();

const storage = multer.diskStorage({
    destination: "Public/Uploads/",
    filename: (req, file, cb) => {
        cb(null, getUniqueFilename(file.originalname));
    },
});

const upload = multer({ storage: storage });

// GET ALL USERS
usersRouter.get("/", async (req, res) => {
    try {
        const result = await UsersDb.getUsers();
              
        if (result) {
            res.send(result)
        } else {
            res.send("error: couldnt get users")
        }

    } catch (error) {
        res.send(error);
    }
});
usersRouter.get("/conn", async (req, res) => {
    try {
        const result = await getDb();
              
        if (result) {
            res.send(result)
        } else {
            res.send("error: couldnt get db")
        }

    } catch (error) {
        res.send(error);
    }
});

// GET ALL PHOTOS
usersRouter.get("/photos", async (req, res) => {
    try {
        const result = await PhotosDb.getPhotos().then(() => {
            console.log(result);
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET ONE USER BY USERNAME
usersRouter.get("/:name", async (req, res) => {
    const username = req.params.name;

    try {
        const result = await UsersDb.getUserByUsername(username).then(() => {
            console.log(result);
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPDATE USER BY ID
usersRouter.put("/:id", async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const data = req.body;

    try {
        const result = await UsersDb.updateUser(userId, data).then(() => {
            console.log(result);
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPDATE USER-ROLE BY ID
usersRouter.put("/:id/role", async (req, res) => {
    const userId = new ObjectId(req.params.id);

    const currentRole = req.body.isAdmin;

    const newRole = currentRole === 0 ? 1 : 0;

    try {
        const result = await UsersDb.changeRole(userId, newRole).then(() => {
            console.log(result);
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400).send(error);
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
    try {
        const result = await PhotosDb.getPhotosByUser(req.params.name).then(
            () => {
                res.status(200).send(result);
            }
        );
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPLOAD NEW PHOTO
usersRouter.post("/upload", upload.single("image"), (req, res) => {
    // const img = fs.readFileSync(req.file.path);
    const image = req.file;
    res.send(image);
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

        try {
            PhotosDb.addPhoto(upload_img).then(() => {
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
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }
});

export default usersRouter;
