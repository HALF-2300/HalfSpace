export function initializeVisitorSession(): string {
  // Check if visitor already has an ID
  const existingId = localStorage.getItem('halfspace_visitor_id');
  
  if (existingId) {
    return existingId;
  }
  
  // Generate a unique visitor ID based on timestamp and random
  const visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('halfspace_visitor_id', visitorId);
  
  return visitorId;
}

export function getVisitorMetadata() {
  const visitCount = parseInt(localStorage.getItem('halfspace_visit_count') || '0');
  const lastVisit = localStorage.getItem('halfspace_last_visit');
  
  // Increment visit count
  localStorage.setItem('halfspace_visit_count', (visitCount + 1).toString());
  localStorage.setItem('halfspace_last_visit', Date.now().toString());
  
  return {
    visitCount: visitCount + 1,
    lastVisit: lastVisit ? new Date(parseInt(lastVisit)) : null,
    isReturning: visitCount > 0
  };
}

export function hasVisitorLingeringMemory(): boolean {
  // Check if visitor has been staring at something
  const stareStart = (window as any).halfspaceStareStart;
  if (!stareStart) return false;
  
  const stareTime = Date.now() - stareStart;
  return stareTime > 5000; // 5 seconds of staring
}

export function trackStareStart() {
  (window as any).halfspaceStareStart = Date.now();
}

export function trackStareEnd() {
  delete (window as any).halfspaceStareStart;
}
