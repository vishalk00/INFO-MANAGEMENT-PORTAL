var mongoose = require('mongoose');

var ProjectInfoSchema = new mongoose.Schema({
    Information: String,
    Type: String,
    ImpNotes: String,
    IsActive : Number,
    DateAdded: { type: Date },
    DateModified: { type: Date },
    Project: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});


ProjectInfoSchema.pre('save', function (next) {
    now = new Date();

    if (!this.dateAdded) {
        this.dateAdded = now;
    }
    next();
});
mongoose.model('ProjectInfo', ProjectInfoSchema);