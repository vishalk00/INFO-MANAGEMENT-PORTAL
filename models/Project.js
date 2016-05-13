var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
   
    ProjectName: String,
    AssignmentNo: String,
    ClientName: String,
    IsActive: Number,
    DateAdded: { type: Date },
    DateModified: { type: Date },
    ProjectInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectInfo' }]
});

ProjectSchema.pre('save', function (next) {
    now = new Date();

    if (!this.dateAdded) {
        this.dateAdded = now;
    }
    next();
});
mongoose.model('Project', ProjectSchema);