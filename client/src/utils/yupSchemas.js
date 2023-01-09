import * as yup from "yup";

export const storeOwnerSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Ism bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("Familiya bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Login bo'sh bo'lishi mumkin emas")
    .min(5, "Login 5 ta belgidan kop bolishi kerak")
    .max(20, "Login 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),
  storeName: yup.string().trim().required("Do'kon nomini kiriting"),

});
export const adminSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Ism bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("Familiya bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Login bo'sh bo'lishi mumkin emas")
    .min(5, "Login 5 ta belgidan kop bolishi kerak")
    .max(20, "Login 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),

});
export const courierSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Ism bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("Familiya bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Login bo'sh bo'lishi mumkin emas")
    .min(5, "Login 5 ta belgidan kop bolishi kerak")
    .max(20, "Login 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),
  regionId: yup.string().trim().required("Viloyatlar bo'sh bo'lishi mumkin emas"),
  tariff: yup.string().trim().required("Tarif bo'sh bo'lishi mumkin emas"),
});
export const storeOwnerSchemaUpdate = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Ism bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("Familiya bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Login bo'sh bo'lishi mumkin emas")
    .min(5, "Login 5 ta belgidan kop bolishi kerak")
    .max(20, "Login 20 ta belgidan kam bolishi kerak"),
  storeName: yup.string().trim().required("Do'kon nomini kiriting"),

});
export const adminSchemaUpdate = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Ism bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("Familiya bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Login bo'sh bo'lishi mumkin emas")
    .min(5, "Login 5 ta belgidan kop bolishi kerak")
    .max(20, "Login 20 ta belgidan kam bolishi kerak"),

});
export const courierSchemaUpdate = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Ism bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("Familiya bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Login bo'sh bo'lishi mumkin emas")
    .min(5, "Login 5 ta belgidan kop bolishi kerak")
    .max(20, "Login 20 ta belgidan kam bolishi kerak"),
  regionId: yup.string().trim().required("Viloyatlar bo'sh bo'lishi mumkin emas"),
});


export const defaultSchema = yup.object().shape({
  userRoleUz: yup
    .string()
    .trim()
    .required("Foydalanuvchi mansabi bo'sh bo'lishi mumkin emas"),})