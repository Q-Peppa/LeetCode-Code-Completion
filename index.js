// ==UserScript==
// @name         LeetCode Monaco JS 原生补全增强 （支持 iframe + 缓存回退）
// @namespace    https://github.com/Q-Peppa/LeetCode-Code-Completion
// @version      2026-03-28
// @description  LeetCode Monaco JS 原生补全增强 （支持 iframe + 缓存回退） + JavaScript 新版本 esnext 全支持
// @author       Peppa
// @license      MIT
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @updateURL    https://raw.githubusercontent.com/Q-Peppa/LeetCode-Code-Completion/refs/heads/main/index.js
// @downloadURL  https://raw.githubusercontent.com/Q-Peppa/LeetCode-Code-Completion/refs/heads/main/index.js
// ==/UserScript==

const LIBS = [
  "lib.dom.d.ts",
  "lib.es5.d.ts",
  "lib.es2015.core.d.ts",
  "lib.es2015.collection.d.ts",
  "lib.es2023.array.d.ts",
  "lib.es2024.object.d.ts",
  "lib.es2024.collection.d.ts",
  "lib.esnext.collection.d.ts",
  "lib.esnext.iterator.d.ts",
];

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
        reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
        findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number;
        includes(searchElement: T, fromIndex?: number): boolean;
        slice(start?: number, end?: number): T[];
        splice(start: number, deleteCount?: number, ...items: T[]): T[];
        push(...items: T[]): number;
        pop(): T | undefined;
        shift(): T | undefined;
        unshift(...items: T[]): number;
        concat(...items: ConcatArray<T>[]): T[];
        join(separator?: string): string;
        reverse(): T[];
        sort(compareFn?: (a: T, b: T) => number): T[];
        every(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        some(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        indexOf(searchElement: T, fromIndex?: number): number;
        lastIndexOf(searchElement: T, fromIndex?: number): number;
        fill(value: T, start?: number, end?: number): T[];
        length: number;
        [n: number]: T;
    }`,
  "lib.es2015.core.d.ts": `interface Promise<T> {
        then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
        catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
        finally(onfinally?: (() => void) | undefined | null): Promise<T>;
    }
    interface PromiseConstructor {
        resolve<T>(value: T | PromiseLike<T>): Promise<T>;
        reject<T = never>(reason?: any): Promise<T>;
        all<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]>;
        race<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;
    }
    declare var Promise: PromiseConstructor;
    interface String {
        includes(searchString: string, position?: number): boolean;
        startsWith(searchString: string, position?: number): boolean;
        endsWith(searchString: string, endPosition?: number): boolean;
        repeat(count: number): string;
    }`,
  "lib.es2015.collection.d.ts": `interface Map<K, V> {
        get(key: K): V | undefined;
        set(key: K, value: V): this;
        has(key: K): boolean;
        delete(key: K): boolean;
        clear(): void;
        readonly size: number;
        forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
        keys(): IterableIterator<K>;
        values(): IterableIterator<V>;
        entries(): IterableIterator<[K, V]>;
    }
    interface MapConstructor {
        new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
    }
    declare var Map: MapConstructor;
    interface Set<T> {
        add(value: T): this;
        has(value: T): boolean;
        delete(value: T): boolean;
        clear(): void;
        readonly size: number;
        forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
        keys(): IterableIterator<T>;
        values(): IterableIterator<T>;
        entries(): IterableIterator<[T, T]>;
    }
    interface SetConstructor {
        new <T>(values?: readonly T[] | null): Set<T>;
    }
    declare var Set: SetConstructor;
    interface WeakMap<K extends object, V> {
        get(key: K): V | undefined;
        set(key: K, value: V): this;
        has(key: K): boolean;
        delete(key: K): boolean;
    }
    interface WeakSet<T extends object> {
        add(value: T): this;
        has(value: T): boolean;
        delete(value: T): boolean;
    }`,
  "lib.es2023.array.d.ts": `interface Array<T> {
        findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
        findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
        toReversed(): T[];
        toSorted(compareFn?: (a: T, b: T) => number): T[];
        toSpliced(start: number, deleteCount?: number, ...items: T[]): T[];
        with(index: number, value: T): T[];
    }`,
  "lib.es2024.object.d.ts": `interface ObjectConstructor {
        groupBy<T, K extends PropertyKey>(items: Iterable<T>, callbackfn: (value: T, index: number) => K): Partial<Record<K, T[]>>;
    }`,
  "lib.es2024.collection.d.ts": `interface Map<K, V> {
        groupBy<T, K>(items: Iterable<T>, callbackfn: (value: T, index: number) => K): Map<K, T[]>;
    }`,
  "lib.esnext.collection.d.ts": `interface Map<K, V> {
        emplace(key: K, handler: { insert(key: K, map: Map<K, V>): V; update(key: K, value: V, map: Map<K, V>): V; }): V;
    }`,
  "lib.esnext.iterator.d.ts": `interface Iterator<T> {
        next(value?: any): IteratorResult<T>;
        return?(value?: any): IteratorResult<T>;
        throw?(e?: any): IteratorResult<T>;
    }
    interface IteratorResult<T, TReturn = any> {
        done: boolean;
        value: TReturn extends undefined ? T : T | TReturn;
    }
    interface Iterable<T> {
        [Symbol.iterator](): Iterator<T>;
    }
    interface IterableIterator<T> extends Iterator<T> {
        [Symbol.iterator](): IterableIterator<T>;
    }`,
};
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
  scrollBeyondLastLine: false,
};
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
  constructor(val?: number, next?: ListNode | null);
 }
 interface LoDashStatic {
        map<T, U>(array: T[], callback: (value: T, index: number, array: T[]) => U): U[];
        filter<T>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): T[];
        add(a: number, b: number): number;
        every<T>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): boolean;
        some<T>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): boolean;
        reduce<T, U>(array: T[], callback: (accumulator: U, value: T, index: number, array: T[]) => U, initialValue: U): U;
        forEach<T>(array: T[], callback: (value: T, index: number, array: T[]) => void): void;
        forEachRight<T>(array: T[], callback: (value: T, index: number, array: T[]) => void): void;
        invert<T>(object: { [index: string]: T }): { [index: string]: string };
        omit<T, K extends keyof T>(object: T, ...paths: K[]): { [index: string]: any };
        pick<T, K extends keyof T>(object: T, ...paths: K[]): { [index: string]: any };
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
 declare const _: LoDashStatic;
`;
var globalMonaco;

(function () {
  "use strict";

  const TSC_VERSION = "5.9.2";
  const CACHE_KEY_PREFIX = `LeetCode_monaco_${TSC_VERSION}_`;
  const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7天过期
  const FETCH_TIMEOUT = 5000;
  const MONACO_WAIT_TIMEOUT = 10000;
  const MONACO_POLL_INTERVAL = 200;
  const CDN_SOURCES = [
    `https://cdn.jsdelivr.net/npm/typescript@${TSC_VERSION}/lib/`,
    `https://unpkg.com/typescript@${TSC_VERSION}/lib/`,
    `https://cdnjs.cloudflare.com/ajax/libs/typescript/${TSC_VERSION}/lib/`,
  ];
  let currentCDNIndex = 0;
  const targetStates = new WeakMap();
  const configuredMonacos = new WeakSet();
  const editorListeners = new WeakSet();
  const timerIds = [];
  let observer = null;

  function getCacheKey(libName = "") {
    return CACHE_KEY_PREFIX + libName;
  }

  function getCacheTimestampKey(libName = "") {
    return CACHE_KEY_PREFIX + libName + "_timestamp";
  }

  function isCacheExpired(libName = "") {
    const timestampKey = getCacheTimestampKey(libName);
    const timestamp = GM_getValue(timestampKey);
    if (!timestamp) return true;
    return Date.now() - timestamp > CACHE_EXPIRY_MS;
  }

  function getFallbackContent(libName = "") {
    const fallback = fallbacks[libName] ?? "";
    GM_log(`[Fallback] 📥 使用本地定义的模型: ${libName}`);
    return fallback;
  }

  function stopWatching() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    timerIds.forEach((timerId) => clearTimeout(timerId));
    timerIds.length = 0;
  }

  async function getLibContent(libName = "") {
    const cacheKey = getCacheKey(libName);
    const cache = GM_getValue(cacheKey);
    if (cache && !isCacheExpired(libName)) {
      GM_log(`[Cache] 📦 命中缓存 ${libName}`);
      return cache;
    }

    if (cache && isCacheExpired(libName)) {
      GM_log(`[Cache] ⏰ 缓存已过期 ${libName}，重新下载`);
    }

    const fetchFromCDN = (cdnUrl, cdnIndex) => {
      return new Promise((resolve, reject) => {
        GM_log(`[Download] 🔍 从 ${cdnUrl} 下载 ${libName}`);
        GM_xmlhttpRequest({
          method: "GET",
          url: cdnUrl + libName,
          onload(data) {
            if (data.status < 200 || data.status >= 300 || !data.responseText) {
              GM_log(`❌ 下载失败 ${libName}: HTTP ${data.status}`);
              reject(new Error(`HTTP ${data.status}`));
              return;
            }
            resolve(data.responseText);
          },
          onerror(error) {
            GM_log(`❌ 下载失败 ${libName}: ${error?.message ?? "unknown"}`);
            reject(error);
          },
          timeout: FETCH_TIMEOUT,
          ontimeout: () => {
            GM_log(`❌ 获取 ${libName} 超时`);
            reject(new Error("timeout"));
          },
        });
      });
    };

    for (let i = 0; i < CDN_SOURCES.length; i++) {
      const cdnIndex = (currentCDNIndex + i) % CDN_SOURCES.length;
      try {
        const text = await fetchFromCDN(CDN_SOURCES[cdnIndex], cdnIndex);
        try {
          GM_setValue(cacheKey, text);
          GM_setValue(getCacheTimestampKey(libName), Date.now());
          GM_log(`📤 缓存成功了 ${libName}`);
        } catch (e) {
          GM_log(`⚠️ 缓存失败了 ${libName}: ${e.message}`);
        }
        currentCDNIndex = cdnIndex;
        return text;
      } catch (e) {
        GM_log(`⚠️ CDN ${cdnIndex + 1} 失败，尝试下一个`);
      }
    }

    GM_log(`❌ 所有CDN源失败`);
    if (cache) {
      GM_log(`⚠️ 使用过期缓存 ${libName}`);
      return cache;
    }
    return getFallbackContent(libName);
  }

  function waitForMonaco(target = unsafeWindow) {
    return new Promise((resolve) => {
      let done = false;
      let intervalId = null;
      let timeoutId = null;

      const finish = (value) => {
        if (done) return;
        done = true;
        if (intervalId) clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
        resolve(value);
      };

      const check = () => {
        if (
          target.monaco?.languages?.typescript &&
          target.monaco?.editor?.createModel
        ) {
          finish(target.monaco);
          return true;
        }
        return false;
      };

      if (check()) return;

      intervalId = setInterval(check, MONACO_POLL_INTERVAL);

      timeoutId = setTimeout(() => {
        finish(null);
      }, MONACO_WAIT_TIMEOUT);
    });
  }

  async function loadAllLibs() {
    return Promise.all(
      LIBS.map(async (libName) => {
        try {
          return [libName, await getLibContent(libName)];
        } catch (e) {
          GM_log(`❌ 处理 ${libName} 时出错: ${e.message}`);
          return [libName, ""];
        }
      })
    );
  }

  function updateEditorOptions(monaco) {
    monaco.editor.getEditors?.().forEach((editor) => {
      editor.updateOptions(options);
    });

    if (editorListeners.has(monaco)) {
      return;
    }

    monaco.editor.onDidCreateEditor((editor) => {
      editor.updateOptions(options);
    });
    editorListeners.add(monaco);
  }

  async function configureMonaco(monaco) {
    if (configuredMonacos.has(monaco)) {
      updateEditorOptions(monaco);
      return true;
    }

    GM_log("🔧 开始配置语言服务");
    const jsDefaults = monaco.languages?.typescript?.javascriptDefaults;
    if (!jsDefaults) {
      return false;
    }

    configuredMonacos.add(monaco);

    try {
      globalMonaco = monaco;
      jsDefaults.addExtraLib(customLibs.trim(), "ts:custom-types.d.ts");

      jsDefaults.setDiagnosticsOptions({
        noSuggestionDiagnostics: false,
        noSyntaxValidation: false,
        noSemanticValidation: false,
      });

      jsDefaults.setCompilerOptions({
        allowJs: true,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget?.ESNext ?? 99,
        noImplicitAny: true,
        noEmit: true,
      });

      const libEntries = await loadAllLibs();
      for (const [libName, content] of libEntries) {
        if (content) {
          jsDefaults.addExtraLib(content, `ts:${libName}`);
          GM_log(`✅ 加载完成: ${libName}`);
        } else {
          GM_log(`❌ 无法获取: ${libName}`);
        }
      }

      updateEditorOptions(monaco);
      jsDefaults.setEagerModelSync(true);
      jsDefaults.setDiagnosticsOptions(jsDefaults.getDiagnosticsOptions());

      GM_log(
        "✅【LeetCode 补全代码】 全部的功能已经就绪、试试输入 const ans = [], ans. 有没有补全 ~"
      );
      return true;
    } catch (e) {
      configuredMonacos.delete(monaco);
      throw e;
    }
  }

  async function enableJSCompletion(target = unsafeWindow) {
    const currentState = targetStates.get(target);
    if (currentState === "configuring" || currentState === "configured") {
      return currentState === "configured";
    }

    targetStates.set(target, "configuring");

    try {
      GM_log("🔍 等待Monaco编辑器加载...");
      const monaco = await waitForMonaco(target);
      if (!monaco) {
        GM_log("❌ 失败：未找到Monaco编辑器");
        targetStates.delete(target);
        stopWatching();
        return false;
      }

      const configured = await configureMonaco(monaco);
      if (!configured) {
        targetStates.delete(target);
        stopWatching();
        return false;
      }

      targetStates.set(target, "configured");
      stopWatching();
      return true;
    } catch (e) {
      GM_log("❌ 初始化出错：" + e.message);
      targetStates.delete(target);
      stopWatching();
      return false;
    }
  }

  function detectMonacoInPage() {
    let found = false;

    if (document?.querySelector(".monaco-editor")) {
      GM_log("发现主页面含有 Monaco！");
      found = true;
      void enableJSCompletion(unsafeWindow);
    }

    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      try {
        const doc = iframe.contentDocument;
        if (doc && doc.querySelector(".monaco-editor")) {
          GM_log("发现 IFrame 页面含有 Monaco！");
          found = true;
          void enableJSCompletion(iframe.contentWindow);
        }
      } catch (e) {
        GM_log("检查iframe时出错（可能是跨域）：" + e.message);
      }
    }

    return found;
  }
  GM_log("🚀 【LeetCode 补全代码】 插件准备加载了~");

  observer = new MutationObserver(() => {
    detectMonacoInPage();
  });

  observer.observe(document, { childList: true, subtree: true });

  const checkTimes = [500, 1000, 2000, 3000];
  checkTimes.forEach((delay) => {
    const timerId = setTimeout(detectMonacoInPage, delay);
    timerIds.push(timerId);
  });

  detectMonacoInPage();
})();
