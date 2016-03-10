var Joi = require('../');


var schema = {
    type: Joi.string().required(),
    subtype: Joi.alternatives()
        .when('type', {is: 'video', then: Joi.valid('mp4', 'wav')})
        .when('type', {is: 'audio', then: Joi.valid('mp3')})
        .when('type', {is: 'image', then: Joi.valid('jpg', 'png')})
        .when('type', {is: 'pdf'  , then: Joi.valid('document')})
};


Joi.assert({ type: 'video', subtype: 'mp4' }, schema); // Pass
Joi.assert({ type: 'video', subtype: 'wav' }, schema); // Pass
Joi.assert({ type: 'other', subtype: 'something' }, schema); // Fail
Joi.assert({ type: 'audio', subtype: 'mp4' }, schema); // Fail
