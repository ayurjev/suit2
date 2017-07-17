export function UnbalancedBracketsError(message) { this.message = (message || ""); }
UnbalancedBracketsError.prototype = new Error();

export function ComponentNotFoundError(message) { this.message = (message || ""); }
ComponentNotFoundError.prototype = new Error();

export function AmbigiousDomRequest(message) { this.message = (message || ""); }
AmbigiousDomRequest.prototype = new Error();
