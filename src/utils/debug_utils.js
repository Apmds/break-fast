export default function isDebugMode() {
    return window.location.hash.includes('debug');
};