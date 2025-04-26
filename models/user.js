import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const ageDifMs = today - value;
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 18;
      },
      message: 'Debes tener al menos 18 años para registrarte.'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  favouriteFlats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flat' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;


