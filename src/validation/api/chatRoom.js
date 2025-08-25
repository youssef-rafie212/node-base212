import i18n from "i18n";
import { body, check, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateChatRoom = [
    body("participants").custom((value) => {
        if (!value) {
            throw i18n.__("participantsRequired");
        }

        if (!Array.isArray(value)) {
            throw i18n.__("invalidParticipants");
        }

        if (value.length < 2) {
            throw i18n.__("invalidParticipants");
        }

        for (const participant of value) {
            if (!mongoose.Types.ObjectId.isValid(participant)) {
                throw i18n.__("invalidParticipants");
            }
        }

        return true;
    }),
];
