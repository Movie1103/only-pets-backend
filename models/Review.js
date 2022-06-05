module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      title: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );
  Review.associate = models => {
    Review.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    Review.belongsTo(models.Service, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Review.hasMany(models.Like, {
      foreignKey: {
        name: 'reviewId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
  };

  return Review;
};
