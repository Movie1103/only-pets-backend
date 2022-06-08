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
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.Rating, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.Photo, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasMany(models.RateCard, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasOne(models.Category, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasOne(models.Address, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
    Service.hasOne(models.Location, {
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
