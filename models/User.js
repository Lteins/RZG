var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User',{autokey: {path: 'slug', from: 'username', unique: true}});

User.add({
    username: { type: String, initial:true, required: true, unique: true, index: true},
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
    phone: {type: Number, initial: true, required: true},
    capital: {type: Types.Money, default: 123.5},
    my_warehouse: { type: Types.Relationship, ref: 'Warehouse', many: false },
    ismember: {type: Boolean},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.virtual('url').get(function(){
    return '/users/' + this.slug;
})


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
