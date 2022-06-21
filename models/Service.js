module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    'Service',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coverPhoto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      openAt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      closeAt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: DataTypes.STRING,
      line: DataTypes.STRING,
      facebook: DataTypes.STRING,
      instagram: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );
  Service.associate = models => {
    Service.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.Review, {
      as: 'reviews',
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.Rating, {
      as: 'ratings',
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.Photo, {
      as: 'photos',
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.RateCard, {
      as: 'rateCard',
      foreignKey: {
        name: 'serviceId',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasOne(models.Category, {
      as: 'category',
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasOne(models.Address, {
      as: 'address',
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasOne(models.Location, {
      as: 'location',
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
  };

  return Service;
};
