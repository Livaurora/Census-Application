const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../models');
const ParticipantService = require('../services/ParticipantService');

const participantService = new ParticipantService(db); // Instantiate with DB models

router.post('/add', auth, async (req, res) => {
	try {
		await participantService.addParticipant(req.body);
		res.status(201).json({ message: 'Participant added successfully' });
	} catch (error) {
		console.error('Add participant failed:', error);
		res.status(400).json({ error: error.message || 'Internal server error' });
	}
});

router.get('/', auth, async (req, res) => {
	try {
		const participants = await participantService.getAllParticipants();
		res.status(200).json(participants);
	} catch (error) {
		console.error('Error fetching participants:', error);
		res.status(500).json({ error: 'Failed to retrieve participants' });
	}
});

router.get('/details', auth, async (req, res) => {
	try {
		const participantsDetails = await participantService.getAllParticipantsDetails();
		res.status(200).json(participantsDetails);
	} catch (error) {
		console.error('Error fetching participants:', error);
		res.status(500).json({ error: 'Failed to retrieve participants' });
	}
});

router.get('/details/:email', auth, async (req, res) => {
	try {
		const { email } = req.params;
		const participant = await participantService.getParticipantDetailsByEmail(email);
		res.status(200).json(participant);
	} catch (error) {
		console.error('Error fetching participant details by email:', error);
		res.status(404).json({ error: error.message });
	}
});

router.get('/work/:email', auth, async (req, res) => {
	try {
		const { email } = req.params;
		const work = await participantService.getWorkDetailsByEmail(email);
		res.status(200).json(work);
	} catch (error) {
		console.error('Error fetching work details:', error);
		res.status(404).json({ error: error.message });
	}
});

router.get('/home/:email', auth, async (req, res) => {
	try {
		const { email } = req.params;
		const home = await participantService.getHomeDetailsByEmail(email);
		res.status(200).json(home);
	} catch (error) {
		console.error('Error fetching home details:', error);
		res.status(404).json({ error: error.message });
	}
});

router.delete('/:email', auth, async (req, res) => {
	try {
		const { email } = req.params;
		const result = await participantService.deleteParticipantByEmail(email);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error deleting participant:', error);
		res.status(404).json({ error: error.message });
	}
});

router.put('/:email', auth, async (req, res) => {
	try {
		const { email } = req.params;
		const result = await participantService.updateParticipantByEmail(email, req.body);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error updating participant:', error);
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;