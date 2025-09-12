// ==UserScript==
// @name         LeetCode Monaco JS 原生补全增强 （支持 iframe + 缓存回退）
// @namespace    http://tampermonkey.net/
// @version      2025-09-09
// @description  LeetCode Monaco JS 原生补全增强 （支持 iframe + 缓存回退）
// @author       Peppa
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==


const fallbacks = {
    "lib.dom.d.ts": `interface Document {
        getElementById(id: string): HTMLElement | null;
    }
    interface Window {
        document: Document;
    }`,
    "lib.es5.d.ts": `interface Array<T> {
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
    }`,
    "lib.es2015.core.d.ts": `interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    }`,
    "lib.es2015.collection.d.ts": `interface Map<K, V> {
        get(key: K): V | undefined;
        set(key: K, value: V): this;
        has(key: K): boolean;
        delete(key: K): boolean;
    }`,
    "lib.esnext.iterator.d.ts": `interface Iterator<T> {
        next(value?: any): IteratorResult<T>;
    }`
}
const options = {
    suggestOnTriggerCharacters: true,
    quickSuggestions: { strings: true, comments: false, other: true },
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on",
    wordBasedSuggestions: "allDocuments",
    suggest: {
        showKeywords: true,
        showMethods: true,
        showFields: true,
        showFunctions: true,
        showModules: true,
        showVariables: true,
        filterGraceful: true,
        preview: true,
    },
    hover: {
        enabled: true,
        delay: 300,
        sticky: true,
    },
    renderErrors: true,
    scrollBeyondLastLine: false
}
const customLibs = `
 declare class PrioriQueue<T>{
   private data: T[];
   constructor(compare?:(a: T, b: T) => number);
   enqueue(data: T): void;
   dequeue(): T | undefined;
   peek(): T | undefined;
   size(): number;
   isEmpty(): boolean;
 }
 declare class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?:number , next: ListNode | null) ;
 }
 declare const console: Console;
 declare const Array:  ArrayConstructor;
 declare const Map:  MapConstructor;
 declare const _: _.LoDashStatic;
 declare interface _.LoDashStatic {
    chunk<T>(array: T[], size?: number): T[][];
    compact<T>(array: T[]): T[];
    concat<T>(array: T[], ...values: Array<T | T[]>): T[];
    difference<T>(array: T[], ...values: T[][]): T[];
    differenceBy<T>(array: T[], values: T[], iteratee: (value: T) => any): T[];
    differenceWith<T>(array: T[], values: T[], comparator: (a: T, b: T) => boolean): T[];
    drop<T>(array: T[], n?: number): T[];
    dropRight<T>(array: T[], n?: number): T[];
    dropRightWhile<T>(array: T[], predicate: (value: T) => boolean): T[];
    dropWhile<T>(array: T[], predicate: (value: T) => boolean): T[];
    fill<T>(array: T[], value: any, start?: number, end?: number): T[];
    findIndex<T>(array: T[], predicate: (value: T) => boolean, fromIndex?: number): number;
    findLastIndex<T>(array: T[], predicate: (value: T) => boolean, fromIndex?: number): number;
    flatten<T>(array: Array<T | T[]>): T[];
    flattenDeep<T>(array: any[]): T[];
    flattenDepth(array: any[], depth?: number): any[];
    fromPairs<T>(pairs: Array<[string, T]>): { [index: string]: T };
    head<T>(array: T[]): T | undefined;
    indexOf<T>(array: T[], value: T, fromIndex?: number): number;
    initial<T>(array: T[]): T[];
    intersection<T>(...arrays: T[][]): T[];
    intersectionBy<T>(arrays: T[][], iteratee: (value: T) => any): T[];
    intersectionWith<T>(arrays: T[][], comparator: (a: T, b: T) => boolean): T[];
    join<T>(array: T[], separator?: string): string;
    last<T>(array: T[]): T | undefined;
    lastIndexOf<T>(array: T[], value: T, fromIndex?: number): number;
    nth<T>(array: T[], n?: number): T | undefined;
    pull<T>(array: T[], ...values: T[]): T[];
    pullAll<T>(array: T[], values: T[]): T[];
    pullAllBy<T>(array: T[], values: T[], iteratee: (value: T) => any): T[];
    pullAllWith<T>(array: T[], values: T[], comparator: (a: T, b: T) => boolean): T[];
    pullAt<T>(array: T[], ...indexes: number[]): T[];
    remove<T>(array: T[], predicate: (value: T) => boolean): T[];
    reverse<T>(array: T[]): T[];
    slice<T>(array: T[], start?: number, end?: number): T[];
    sortedIndex<T>(array: T[], value: T): number;
    sortedIndexBy<T>(array: T[], value: T, iteratee: (value: T) => any): number;
    sortedIndexOf<T>(array: T[], value: T): number;
    sortedLastIndex<T>(array: T[], value: T): number;
    sortedLastIndexBy<T>(array: T[], value: T, iteratee: (value: T) => any): number;
    sortedLastIndexOf<T>(array: T[], value: T): number;
    sortedUniq<T>(array: T[]): T[];
    sortedUniqBy<T>(array: T[], iteratee: (value: T) => any): T[];
    tail<T>(array: T[]): T[];
    take<T>(array: T[], n?: number): T[];
    takeRight<T>(array: T[], n?: number): T[];
    takeRightWhile<T>(array: T[], predicate: (value: T) => boolean): T[];
    takeWhile<T>(array: T[], predicate: (value: T) => boolean): T[];
    union<T>(...arrays: T[][]): T[];
    unionBy<T>(arrays: T[][], iteratee: (value: T) => any): T[];
    unionWith<T>(arrays: T[][], comparator: (a: T, b: T) => boolean): T[];
    uniq<T>(array: T[]): T[];
    uniqBy<T>(array: T[], iteratee: (value: T) => any): T[];
    uniqWith<T>(array: T[], comparator: (a: T, b: T) => boolean): T[];
    unzip<T>(array: T[][]): T[][];
    unzipWith<T, R>(array: T[][], iteratee: (...values: T[]) => R): R[];
    without<T>(array: T[], ...values: T[]): T[];
    xor<T>(...arrays: T[][]): T[];
    xorBy<T>(arrays: T[][], iteratee: (value: T) => any): T[];
    xorWith<T>(arrays: T[][], comparator: (a: T, b: T) => boolean): T[];
    zip<T>(...arrays: T[][]): T[][];
    zipObject(props: string[], values: any[]): { [index: string]: any };
    zipObjectDeep(props: string[], values: any[]): { [index: string]: any };
    zipWith<T, R>(arrays: T[][], iteratee: (...values: T[]) => R): R[];
 }
`;



(function () {
    "use strict";

    const TSC_VERSION = "5.9.2";
    const CACHE_KEY_PREFIX = "LeetCode_monaco_V2"
    const FETCH_TIMEOUT = 5000;
    const MAX_RETRY = 2;
    const U = `https://cdn.jsdelivr.net/npm/typescript@${TSC_VERSION}/lib/`;


    const LIBS = [
        'lib.dom.d.ts',
        'lib.es5.d.ts',
        'lib.es2015.core.d.ts',
        'lib.es2015.collection.d.ts',
        'lib.es2023.array.d.ts',
        'lib.es2024.object.d.ts'
    ]

    function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
        return Promise.race([
            fetch(url),
            new Promise((res, rej) => {
                setTimeout(() => {
                    rej(new Error(`Fetch timeout ${url}`));
                }, timeout)
            })
        ])
    }

    async function fetchWithRetry(libName, attempt = 1) {
        const url = U + libName;
        try {
            GM_log(`[Fetch] 🔍 尝试第 ${attempt} 次加载 ${libName}`);
            const res = await fetchWithTimeout(url);
            if (!res.ok) {
                throw new Error("Http Status " + res.status);
            }
            const text = await res.text();
            try {
                GM_setValue(CACHE_KEY_PREFIX + libName, text);
                GM_log(`📤 缓存成功了 ${libName}`);
                return text;
            } catch (e) {
                GM_log(`⚠️ 缓存失败了 ${libName}: ${e.message}`);
                return text; // 即使缓存失败，也返回内容
            }
        } catch (err) {
            GM_log(`❌ 加载失败 ${libName}: ${err.message}`);
            if (attempt < MAX_RETRY) {
                await new Promise(r => setTimeout(r, 1000 * attempt));
                return fetchWithRetry(libName, attempt + 1);
            }
            return null; // 达到最大重试次数
        }
    }

    async function getLibContent(libName = '') {
        // 先检查缓存
        const cache = GM_getValue(CACHE_KEY_PREFIX + libName);
        if (cache) return cache;

        // 尝试从网络获取
        const remote = await fetchWithRetry(libName);
        if (remote) return remote;

        // 最后使用回退
        GM_log(`[Fallback] 📥 使用本地定义的模型: ${libName}`);
        return fallbacks[libName] ?? '';
    }

    function waitForMonaco(target = window) {
        return new Promise(resolve => {
            const check = () => {
                if (target.monaco && target.monaco.languages?.typescript &&
                    target.monaco.editor && target.monaco.editor.createModel) {
                    resolve(target.monaco);
                    return true;
                }
                return false;
            };

            if (check()) return;

            const interval = setInterval(check, 200);
            // 延长超时时间到15秒
            setTimeout(() => {
                clearInterval(interval);
                resolve(null);
            }, 15000);
        });
    }

    async function enableJSCompletion(target = window) {

        let monaco;
        try {
            GM_log("🔍 等待Monaco编辑器加载...");
            monaco = await waitForMonaco(target);
            if (!monaco) {
                GM_log("❌ 失败：未找到Monaco编辑器");
                return;
            }
        } catch (e) {
            GM_log("❌ 初始化出错：" + e.message);
            return;
        }

        GM_log("🔧 开始配置语言服务", monaco);
        const jsDefaults = monaco.languages.typescript.javascriptDefaults;


        // 添加自定义类型（这是基础类型，先加载）
        jsDefaults.addExtraLib(customLibs.trim(), "ts:custom-types.d.ts");

        jsDefaults.setDiagnosticsOptions({
            noSuggestionDiagnostics: false,
            noSyntaxValidation: false,
            noSemanticValidation: false,
        });

        jsDefaults.setCompilerOptions({
            allowJs: true,
            allowNonTsExtensions:true,
            target: 99,
            checkJs: true,
            strict: true,
            noImplicitAny: true,
            noEmit: true,
        })

        // 按顺序加载类型定义，确保依赖正确
        for (const libName of LIBS) {
            try {
                const content = await getLibContent(libName);
                if (content) {
                    const uri = `ts:${libName}`;
                    jsDefaults.addExtraLib(content, uri);
                    GM_log(`✅ 加载完成: ${libName}`);
                } else {
                    GM_log(`❌ 无法获取: ${libName}`);
                }
            } catch (e) {
                GM_log(`❌ 处理 ${libName} 时出错: ${e.message}`);
            }
        }

        GM_log("🚀 【LeetCode 补全代码】 LIBS 全部加载完成了");

        // 确保模型存在且正确设置语言
        const models = monaco.editor.getModels?.() || [];
        models.forEach(model => {
            try {
                const modelUri = model.uri.toString();
                const id = model.getLanguageId();

                if (id !== 'javascript') {
                    GM_log(`🔄 将模型 ${modelUri} 切换为JavaScript`);
                    monaco.editor.setModelLanguage(model, 'javascript');
                }
            } catch (e) {
                GM_log(`⚠️ 处理模型时出错: ${e.message}`);
            }
        });

        // 添加模型创建监听，确保新模型正确配置
        monaco.editor.onDidCreateModel(model => {
            try {
                if (model.getLanguageId() !== 'javascript') {
                    GM_log(`🔄 为新模型设置JavaScript语言`);
                    monaco.editor.setModelLanguage(model, 'javascript');
                }
            } catch (e) {
                GM_log(`⚠️ 创建新模型时出错: ${e.message}`);
            }
        });

        // 更新现有编辑器选项
        monaco.editor.getEditors?.().forEach(editor => {
            editor.updateOptions({...options});
        });

        // 为新创建的编辑器设置选项
        monaco.editor.onDidCreateEditor(editor => {
            editor.updateOptions({...options});
        });

        // 最后启用模型同步
        jsDefaults.setEagerModelSync(true);

        // 强制刷新语言服务
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
            monaco.languages.typescript.javascriptDefaults.getDiagnosticsOptions()
        );

        GM_log("✅【LeetCode 补全代码】 全部的功能已经就绪、试试输入 const ans = [], ans. 有没有补全 ~");
    }

    function detectMonacoInPage() {
        // 检查主页面
        if (document?.querySelector(".monaco-editor")) {
            GM_log("发现主页面含有 Monaco！");
            enableJSCompletion(window);
            return true;
        }

        // 检查所有iframe
        const iframes = document.querySelectorAll("iframe");
        for (const iframe of iframes) {
            try {
                const doc = iframe.contentDocument;
                if (doc && doc.querySelector(".monaco-editor")) {
                    GM_log("发现 IFrame 页面含有 Monaco！");
                    enableJSCompletion(iframe.contentWindow);
                    return true;
                }
            } catch (e) {
                // 跨域访问会抛出异常，忽略
                GM_log("检查iframe时出错（可能是跨域）：" + e.message);
            }
        }

        return false;
    }
    GM_log("🚀 【LeetCode 补全代码】 插件准备加载了~");

    const observer = new MutationObserver(() => {
        if (detectMonacoInPage()) {
            observer.disconnect();
        }
    });

    observer.observe(document, {childList: true, subtree: true});

    // 多次检查机制，提高成功率
    const checkTimes = [500, 1000, 2000, 3000, 5000];
    checkTimes.forEach(delay => {
        setTimeout(detectMonacoInPage, delay);
    });
})();
