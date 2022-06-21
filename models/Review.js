module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      replyToId: DataTypes.INTEGER,
      like: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
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
      as: 'likes',
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
