const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { json } = require('express')


// @desc Get all notes
// @route GET /notes
// @access Private
const getAllnotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().select('-password').lean()
    // check if there is a user and if the user have any length
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }
    res.json(notes)
})

// @desc Create new notes
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    // should this be username(name) or user(id)?
    const { username, title, text } = req.body

    //confirm data
    if (!username || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate
    const duplicate = await Note.findOne({ title }).lean().exec() && await Note.findOne({ text }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note' })
    }

    // check if user exist and find user id
    const user = await User.findOne({ username }).lean().exec()
    if (!user) {
        return res.status(400).json({ message: "User don't exist" })
    }

    const noteObject = { user, title, text }

    //create and store new note
    const note = await Note.create(noteObject)
    if (note) {
        res.status(201).json({ message: `New note ${title}: ${text} created for user ${username}` })
    } else {
        res.status(400).json({ message: 'Invalid data receive' })
    }
})

// @desc update notes
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { _id, title, text } = req.body

    // confirm data
    if (!_id || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
        // return res.status(400).json({ message: `${id}\t${Array.isArray(roles)}\t${roles.length}\t${active}` })
    }

    const note = await Note.findById(_id).exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // update  note object 
    note.title = title
    note.text = text

    const updatedNote = await note.save()

    res.json({ message: `note been updated` })
})

// @desc Delete notes
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    const note = await Note.findById(_id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note title: ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllnotes, createNewNote, updateNote, deleteNote
}