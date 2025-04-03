module.exports = (sequelize, Sequelize) => {
	const WorkDetails = sequelize.define(
		'WorkDetails',
		{
			companyname: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			salary: {
				type: Sequelize.DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			currency: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);

	WorkDetails.associate = function (models) {
		WorkDetails.belongsTo(models.Participant, {
			foreignKey: { name: 'participantId', allowNull: false },
			onDelete: 'CASCADE',
		});
	};

	return WorkDetails;
};
