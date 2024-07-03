"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const axios_1 = __importDefault(require("axios"));
let AppService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppService = _classThis = class {
        constructor() {
            const telegramApiKey = process.env.TELEGRAM_API_KEY;
            if (!telegramApiKey) {
                throw new Error('TELEGRAM_API_KEY is not set');
            }
            this.bot = new telegraf_1.Telegraf(telegramApiKey);
            this.bot.start((ctx) => ctx.reply('Welcome to ChooseCheap Bot! Use /search <product> to get the best price.'));
            this.bot.command('search', (ctx) => this.handleSearch(ctx));
            this.bot.launch();
        }
        handleSearch(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const productName = ctx.message.text.split(' ').slice(1).join(' ');
                if (!productName) {
                    return ctx.reply('Please provide a product name.');
                }
                try {
                    const response = yield axios_1.default.get('http://localhost:3003/compare', {
                        params: { product: productName },
                    });
                    const comparison = response.data;
                    const amazon = comparison.amazon;
                    const mercadoLibre = comparison.mercadoLibre;
                    ctx.reply(`Amazon:\nNombre: ${amazon.Nombre}\nDescripción: ${amazon.Descripción}\nPrecio: ${amazon.Precio}\nImagen: ${amazon.Imagen}\nURL: ${amazon.URL}\n\n` +
                        `Mercado Libre:\nNombre: ${mercadoLibre.Nombre}\nDescripción: ${mercadoLibre.Descripción}\nPrecio: ${mercadoLibre.Precio}\nImagen: ${mercadoLibre.Imagen}\nURL: ${mercadoLibre.URL}`);
                }
                catch (error) {
                    console.error('Error comparing prices:', error);
                    ctx.reply('Failed to compare prices. Please try again later.');
                }
            });
        }
    };
    __setFunctionName(_classThis, "AppService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppService = _classThis;
})();
exports.AppService = AppService;
