const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    emailChecked: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    checkedLink: {type: DataTypes.STRING}
}, {
    /*hooks: {
        // создаем корзину при регистрации
        /!*afterCreate({dataValues}, options) {
            Basket.addData({id_user: dataValues.id}).catch((e) => console.log(e.message))
        },*!/
    }*/
})

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const GeneralBasket = sequelize.define('generalBasket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    id_user:{type: DataTypes.INTEGER, allowNull: false},
    id_device:{type: DataTypes.INTEGER, allowNull: false},
    id_size:{type: DataTypes.INTEGER, allowNull: false},
    quantity_chosen:{type: DataTypes.INTEGER, allowNull: false},
    paid:{type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}

})

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, unique: true, allowNull: false},
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
})

const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.BOOLEAN , allowNull: false}
})

const Size = sequelize.define('size', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.INTEGER, allowNull: false, unique: true},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
})

const Path = sequelize.define('path', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})


const SizeDevice = sequelize.define('sizeDevice', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    id_size: {
        type: DataTypes.INTEGER,
        references: {
            model: Size,
            key: 'id'
        }
    },
    id_device: {
        type: DataTypes.INTEGER,
        references: {
            model: Device,
            key: 'id'
        }
    },
    quantity: {type: DataTypes.INTEGER, allowNull: false}

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
User.hasMany(GeneralBasket, {
    foreignKey: {
        name: "id_user"
    }
})
GeneralBasket.belongsTo(User, {
    foreignKey: {
        name: "id_user"
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
User.hasMany(Role, {
    foreignKey: {
        name: "id_user", allowNull: false
    }
})
Role.belongsTo(User, {
    foreignKey: {
        name: "id_user", allowNull: false
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
User.hasOne(Token, {
    foreignKey: {
        name: "id_user", allowNull: false, unique: true
    }
})
Token.belongsTo(User, {
    foreignKey: {
        name: "id_user", allowNull: false, unique: true
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Category.hasMany(Device, {
    foreignKey: {
        name: 'id_category', allowNull: false
    }
})
Device.belongsTo(Category, {
    foreignKey: {
        name: 'id_category', allowNull: false
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Type.hasMany(Device, {
    foreignKey: {
        name: 'id_type', allowNull: false
    }
})
Device.belongsTo(Type, {
    foreignKey: {
        name: 'id_type', allowNull: false
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Device.hasMany(GeneralBasket, {
    foreignKey: {
        name: 'id_device', allowNull: false
    }
})
GeneralBasket.belongsTo(Device, {
    foreignKey: {
        name: 'id_device', allowNull: false
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Size.belongsToMany(Device, {
    through: SizeDevice, foreignKey: {
        name: "id_size", allowNull: false
    }
})
Device.belongsToMany(Size, {
    through: SizeDevice, foreignKey: {
        name: "id_device", allowNull: false
    }
})


Size.hasMany(SizeDevice, {
    foreignKey: {
        name: 'id_size', allowNull: false
    }
})
SizeDevice.belongsTo(Size, {
    foreignKey: {
        name: 'id_size', allowNull: false
    }
})
Device.hasMany(SizeDevice, {
    foreignKey: {
        name: 'id_device', allowNull: false
    },
    onDelete: 'CASCADE',
    //hooks: true
})
SizeDevice.belongsTo(Device, {
    foreignKey: {
        name: 'id_device', allowNull: false
    }
})

Size.hasMany(GeneralBasket, {
    foreignKey: "id_size"
})
GeneralBasket.belongsTo(Size, {
    foreignKey: "id_size"
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Device.hasMany(Path, {
    foreignKey: {
        name: 'id_device', allowNull: false
    },
    onDelete: 'CASCADE',
})
Path.belongsTo(Device, {
    foreignKey: {
        name: 'id_device', allowNull: false
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    User, Role, GeneralBasket, Token, Device, Size, Type, Category, SizeDevice, Path
}

