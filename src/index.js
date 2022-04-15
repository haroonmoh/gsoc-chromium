import { initializeApp } from "firebase/app";
import {  collection, query, orderBy, limit, getFirestore } from "firebase/firestore";
import "./button-clicks";
import { addJob, validateFields, makeTable, initUpdatePage, updateJob } from "./jobs-functions"
import "./styles/index.css";
import VALUES from "./values";
import regeneratorRuntime from "regenerator-runtime";

const firebaseConfig = {
    apiKey: "AIzaSyCyJ0vJxbxKVRHM5oLbxXWf2agCgFj0Xwk",
    authDomain: "jobs-aggregation.firebaseapp.com",
    projectId: "jobs-aggregation",
    storageBucket: "jobs-aggregation.appspot.com",
    messagingSenderId: "636896846940",
    appId: "1:636896846940:web:db0cb2ffed9452b432b299",
    measurementId: "G-S67S9Y9JF3"
};

// Initialize Firebase (Firestore and Analytics)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
VALUES.db = db;

if (window.location.href.indexOf('add') != -1) {
    $('#submit-job').click(function () {
        if (validateFields()) {
            addJob(db);
        }
    });
} else if(window.location.href.indexOf('update') != -1) {
    // grab job id from url and load into html tree
    let url = new URL(window.location.href)
    let jobId = url.searchParams.get('id')
    initUpdatePage(db, jobId)
    $('#update-job').click(function() {
        if (validateFields()) {
            updateJob(db, jobId);
        }
    })
} else {
    let url = new URL(window.location.href)
    let jobSuccess = url.searchParams.get('job')
    if (jobSuccess == "success" || jobSuccess == "editsuccess") {
        setTimeout(function() {
            let snackbarContainer = document.querySelector('#snackbar-container');
            snackbarContainer.MaterialSnackbar.showSnackbar({
                message: jobSuccess == "success" ? 'Job successfully added!' : 'Job successfully updated!'
            });
            window.history.replaceState(null, null, window.location.pathname)
        }, 3000);
    } 
    makeTable(db, query(collection(VALUES.db, "jobs"), orderBy('created', 'desc'), limit(10)), true)
}