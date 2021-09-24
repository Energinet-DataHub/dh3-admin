"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var glob = require("glob");
var fs = require("fs");
var path = require("path");
var config = require("./../../../.licenserc.json");
var license = {
    ts: "/* Copyright 2020 Energinet DataHub A/S,\n *\n * Licensed under the Apache License, Version 2.0 (the \"License2\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n",
    scss: "/* Copyright 2020 Energinet DataHub A/S,\n*\n* Licensed under the Apache License, Version 2.0 (the \"License2\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n*     http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*/\n",
    html: "<!-- \n* Copyright 2020 Energinet DataHub A/S,\n*\n* Licensed under the Apache License, Version 2.0 (the \"License2\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n*     http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n--->\n"
};
function addLicenseExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var projectRoot, globs, licenses, files, success;
        return __generator(this, function (_a) {
            projectRoot = context.workspace.projects[context.projectName].root;
            globs = Object.keys(config);
            licenses = {};
            globs.forEach(function (glob) {
                licenses[path.extname(glob)] = config[glob];
            });
            console.info("Adding licenses...");
            files = glob.sync(
            // Everything: '{,!(node_modules|dist)/**/}*{.ts,.scss,.html}',
            "apps/dh-app{/" + globs.join(',/') + "}");
            files.forEach(function (file) {
                try {
                    var data = fs.readFileSync(file, 'utf8');
                    var licenseTxt = licenses[path.extname(file)].join('\n');
                    var isLicensed = checkForLicense(data, licenseTxt);
                    console.log('is licensed:', isLicensed, file);
                    if (!isLicensed) {
                        addLicense(file, data, licenseTxt);
                    }
                }
                catch (err) {
                    console.error(err);
                }
            });
            success = true;
            return [2 /*return*/, { success: success }];
        });
    });
}
exports["default"] = addLicenseExecutor;
function addLicense(file, content, license) {
    try {
        fs.writeFileSync(file, license + '\n' + content);
        console.log('Added license to', file);
        return true;
    }
    catch (err) {
        console.error(err);
        return err;
    }
}
function checkForLicense(content, license) {
    if (!license)
        return;
    return removeWhitespace(content).startsWith(removeWhitespace(license));
}
function removeWhitespace(str) {
    return str.replace(/\s/g, '');
}
