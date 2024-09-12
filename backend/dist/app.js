"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uploadImage_1 = require("./routes/uploadImage");
const confirmMeasure_1 = require("./routes/confirmMeasure");
const getCustomerCodeList_1 = require("./routes/getCustomerCodeList");
const getTemporaryPage_1 = require("./routes/getTemporaryPage");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '100mb' }));
app.use(uploadImage_1.uploadImage);
app.use(confirmMeasure_1.confirmMeasure);
app.use(getCustomerCodeList_1.getCustomerCodeList);
app.use(getTemporaryPage_1.getTemporaryPage);
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
