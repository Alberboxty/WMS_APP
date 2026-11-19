import { body } from "express-validator";

export const validarInventario = [
    body('section')
        .optional({ nullable: true })
        .customSanitizer(v => {
            const s = String(v ?? '').trim().toUpperCase()
            return s === '' ? null : s
        })
        .custom(v => v === null || /^[A-Z0-9]{1,10}$/.test(v))
        .withMessage('Sección inválida'),
]

