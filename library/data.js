//dependence
const fs = require('fs');
const path = require('path');


const lib = {};

//file directory for save, edit, delete, update
const fileDir = path.join(__dirname, '../.data/');
// const fileName = fileDir + dir + '/' + file + '.json';

//create file with data
lib.create = (dir, file, data, callback) => {
    // file directory
    const fileName = fileDir + dir + '/' + file + '.json';
    //open file
    fs.open(fileName, 'wx', (err, fileDescriptor) => {
        //error through when file exist
        if (err && !fileDescriptor) return callback("Sorry the file is already exist!");

        //stringify data
        const stringData = JSON.stringify(data);

        //send data to file
        fs.writeFile(fileDescriptor, stringData, (error) => {
            //error through when unable to write
            if (error) return callback("Unable to write the file!");
            fs.close(fileDescriptor, (errors) => {
                //error through when unable to close
                if (errors) return callback("Sorry! We can't close the file.");
                callback(false);
            });
        });

    });
}

//read file data
lib.read = (dir, file, callback) => {
    const fileName = fileDir + dir + '/' + file + '.json';
    fs.readFile(fileName, 'utf-8', (err, data) => {

        callback(err, data);
    });
}

//update the file with data
lib.update = (dir, file, data, callback) => {
    // file directory
    const fileName = fileDir + dir + '/' + file + '.json';
    //open file
    fs.open(fileName, 'r+', (err, fileDescriptor) => {
        //error through when file exist
        if (err && !fileDescriptor) return callback("Sorry the file doesn't exist!");

        //stringify data
        const stringData = JSON.stringify(data);

        //send data to file
        fs.ftruncate(fileDescriptor, (err) => {
            if (err) return callback("Unable to to truncate.");


            fs.writeFile(fileDescriptor, stringData, (error) => {
                //error through when unable to write the file
                if (error) return callback(404, { err: "Unable to write the file!" });
                fs.close(fileDescriptor, (Error) => {
                    //error through when unable to close the file
                    if (Error) return callback("Sorry! We can't close the file.");
                    callback(false);
                });
            });
        });
    });
}

//delete file form the directory 
lib.delete = (dir, file, callback) => {
    // file directory
    const fileName = fileDir + dir + '/' + file + '.json';
    //unlink the files
    fs.unlink(fileName, (err) => {
        //error through when the file unable to delete
        if (err) return callback("Opps! we can't delete the file.");
        callback(false);
    });
}




module.exports = lib;
