export function formatMessageTime(data:Date|string  |number) {
    return new Date(data).toLocaleTimeString('en-us', {hour: '2-digit', minute:'2-digit', hour12: false});
}