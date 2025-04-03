class ParticipantService {
	constructor(db) {
		this.client = db.sequelize;
		this.Participant = db.Participant;
		this.WorkDetails = db.WorkDetails;
		this.HomeDetails = db.HomeDetails;
	}

	async addParticipant(data) {
		const { email, firstname, lastname, dob, work, home } = data;

		// ✅ Basic validation
		if (!email || !firstname || !lastname || !dob || !work || !home) {
			throw new Error('Missing required fields');
		}

		if (!/^\S+@\S+\.\S+$/.test(email)) {
			throw new Error('Invalid email format');
		}

		if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
			throw new Error('DOB must be in YYYY-MM-DD format');
		}

		try {
			const participant = await this.Participant.create({
				email,
				firstname,
				lastname,
				dob,
			});

			await this.WorkDetails.create({
				companyname: work.companyname,
				salary: work.salary,
				currency: work.currency,
				participantId: participant.id,
			});

			await this.HomeDetails.create({
				country: home.country,
				city: home.city,
				participantId: participant.id,
			});

			return participant;
		} catch (error) {
			throw new Error(error.message);
		}
	}

    async getAllParticipants() {
        try {
            return await this.Participant.findAll({
                include: [
                    {
                        model: this.WorkDetails,
                        attributes: ['companyname', 'salary', 'currency'],
                    },
                    {
                        model: this.HomeDetails,
                        attributes: ['country', 'city'],
                    }
                ],
                attributes: ['email', 'firstname', 'lastname', 'dob'],
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllParticipantsDetails() {
        try {
            const participants = await this.Participant.findAll({
                attributes: ['email', 'firstname', 'lastname', 'dob'],
                order: [['lastname', 'ASC']],
            });
            return participants;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getParticipantDetailsByEmail(email) {
        try {
            const participant = await this.Participant.findOne({
                where: { email },
                attributes: ['firstname', 'lastname', 'dob']
            });
    
            if (!participant) {
                throw new Error('Participant not found');
            }
    
            return participant;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getWorkDetailsByEmail(email) {
        try {
            const participant = await this.Participant.findOne({
                where: { email },
                include: {
                    model: this.WorkDetails,
                    attributes: ['companyname', 'salary', 'currency']
                }
            });
    
            if (!participant || !participant.WorkDetail) {
                throw new Error('Work details not found');
            }
    
            return participant.WorkDetail;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getHomeDetailsByEmail(email) {
        try {
            const participant = await this.Participant.findOne({
                where: { email },
                include: {
                    model: this.HomeDetails,
                    attributes: ['country', 'city']
                }
            });
    
            if (!participant || !participant.HomeDetail) {
                throw new Error('Home details not found');
            }
    
            return participant.HomeDetail;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async deleteParticipantByEmail(email) {
        try {
            const participant = await this.Participant.findOne({ where: { email } });
    
            if (!participant) {
                throw new Error('Participant not found');
            }
    
            await participant.destroy(); 
            return { message: 'Participant deleted successfully' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async updateParticipantByEmail(email, data) {
        const { firstname, lastname, dob, work, home } = data;
    
        // Validate input
        if (!firstname || !lastname || !dob || !work || !home) {
            throw new Error('Missing required fields');
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            throw new Error('DOB must be in YYYY-MM-DD format');
        }
    
        const participant = await this.Participant.findOne({
            where: { email },
            include: [this.WorkDetails, this.HomeDetails],
        });
    
        if (!participant) {
            throw new Error('Participant not found');
        }
    
        // Update main participant info
        await participant.update({ firstname, lastname, dob });
    
        // Update work
        if (participant.WorkDetail) {
            await participant.WorkDetail.update({
                companyname: work.companyname,
                salary: work.salary,
                currency: work.currency,
            });
        }
    
        // Update home
        if (participant.HomeDetail) {
            await participant.HomeDetail.update({
                country: home.country,
                city: home.city,
            });
        }
    
        return { message: 'Participant updated successfully' };
    }
}

module.exports = ParticipantService;

