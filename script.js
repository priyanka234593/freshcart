'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/* ------------------ Configuration ------------------ */
const DEFAULT_REPORT_ENDPOINT = 'https://firewall-ai.shaeryldatatech.in/firewall/static';

/* ------------------ Helpers ------------------ */
const sanitize = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"'`]/g, (tag) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[tag])
  );
};

const isSuspicious = (value) => {
  if (typeof value !== "string") return false;
  const patterns = [
    /<script/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /javascript:/i,
    /data:/i,
    /['"`]\s*or\s*1=1/i,
    /union\s+select/i,
    /drop\s+table/i,
    /\.\.\//,              // path traversal
    /;\s*rm\s+-rf/i,       // command injection
    /eval\(/i,
    /base64,?decode/i,
  ];
  return patterns.some((p) => p.test(value));
};

const getReportedPages = () => JSON.parse(sessionStorage.getItem('reportedPages') || '[]');
const saveReportedPage = (path) => {
  const pages = getReportedPages();
  if (!pages.includes(path)) {
    pages.push(path);
    sessionStorage.setItem('reportedPages', JSON.stringify(pages));
  }
};

const getCustomRules = () => JSON.parse(sessionStorage.getItem('firewallRules') || '[]');
const saveCustomRules = (rules) => sessionStorage.setItem('firewallRules', JSON.stringify(rules));

const getReportEndpoint = () => {
  return sessionStorage.getItem('firewallEndpoint') || DEFAULT_REPORT_ENDPOINT;
};

const detectOSAndBrowser = async () => {
  let os = 'Unknown OS';
  let browserVersion = 'Unknown';
  try {
    if (navigator.userAgentData) {
      const uaData = await navigator.userAgentData.getHighEntropyValues([
        'platform',
        'platformVersion',
        'uaFullVersion',
      ]);
      const major = parseInt((uaData.platformVersion || '0').split('.')[0] || '0');
      if (uaData.platform === 'Windows') {
        os = major >= 13 ? 'Windows 11' : 'Windows 10 or earlier';
      } else {
        os = uaData.platform || 'Unknown';
      }
      browserVersion = uaData.uaFullVersion || 'Unknown';
    } else {
      const ua = navigator.userAgent;
      if (ua.includes('Windows NT 10.0')) os = 'Windows 10 / 11';
      else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
      else if (ua.includes('Mac OS X')) os = 'macOS';
      else if (ua.includes('Linux')) os = 'Linux';
      browserVersion = (ua.match(/(Chrome|Firefox)\/([0-9.]+)/) || [])[2] || 'Unknown';
    }
  } catch {}
  return { os, browserVersion };
};

const isBot = (ua) => /bot|crawler|spider|crawl|slurp|robot|fetch/i.test(ua);

const getISTTimestamp = () => {
  const now = new Date();
  const istOffset = 330;
  const localTime = new Date(now.getTime() + istOffset * 60000 - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().replace('T', ' ').split('.')[0];
};

const getPublicIP = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const { ip } = await res.json();
    if (ip) return ip;
  } catch {}
  try {
    const res = await fetch("https://api.myip.com");
    const data = await res.json();
    if (data?.ip) return data.ip;
  } catch {}
  return "Unknown";
};

/* ------------------ Component ------------------ */
export default function TrafficReporter() {
  const location = useLocation();
  const reportedRef = useRef(new Set());
  const [blocked, setBlocked] = useState(false);
  const [userIP, setUserIP] = useState('Unknown');
  const loginAttemptRef = useRef({});

  const blockUser = useCallback((reason = 'Access Denied by Firewall') => {
    try {
      setBlocked(true);
      document.body.innerHTML = `
        <div style="text-align:center;margin-top:60px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
          <h1 style="font-size:28px">🚫 Access Denied</h1>
          <p style="color:#333">${sanitize(reason)}</p>
        </div>
      `;
      document.body.style.pointerEvents = 'none';
      document.body.style.userSelect = 'none';
    } catch {
      setBlocked(true);
    }
  }, []);

  const checkCustomRules = useCallback(
    (path) => {
      const rules = getCustomRules();
      for (const rule of rules) {
        try {
          if (rule.type === 'url' && path.includes(rule.value)) {
            blockUser(`Blocked by Firewall Rule: URL match ${rule.value}`);
            return true;
          }
          if (rule.type === 'ip' && userIP === rule.value) {
            blockUser(`Blocked by Firewall Rule: IP ${rule.value}`);
            return true;
          }
          if (rule.type === 'port' && window.location.port === rule.value.toString()) {
            blockUser(`Blocked by Firewall Rule: Port ${rule.value}`);
            return true;
          }
        } catch {}
      }
      return false;
    },
    [blockUser, userIP]
  );

  useEffect(() => {
    if (blocked) return;

    (async () => {
      const ip = await getPublicIP();
      setUserIP(ip);
    })();

    const path = location.pathname || '/';
    if (checkCustomRules(path)) return;

    let action = 'PageVisit';
    if (path.includes('login')) action = 'LoginAttempt';
    else if (path.includes('signup') || path.includes('register')) action = 'SignupAttempt';
    else if (path.includes('cart')) action = 'CartPageVisit';

    if (reportedRef.current.has(path)) return;
    if (getReportedPages().includes(path)) return;

    const reportPayload = async (extraData = {}) => {
      const ip = await getPublicIP();
      const { os, browserVersion } = await detectOSAndBrowser();
      const userAgent = navigator.userAgent || 'Unknown';

      const payload = {
        ip,
        url: window.location.href,
        userAgent: sanitize(userAgent),
        timestamp: getISTTimestamp(),
        action,
        os,
        browserVersion,
        bot: isBot(userAgent),
        ...extraData,
      };

      const endpoint = getReportEndpoint();

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "cors",
          credentials: "include",
        });

        if (response.status === 403 || response.status === 429) {
          const data = await response.json().catch(() => ({}));
          blockUser(data.reason || "Access Denied");
        }
      } catch {}
    };

    const timeout = setTimeout(() => {
      reportPayload();
      saveReportedPage(path);
      reportedRef.current.add(path);
    }, 200);

    /* --------- Input Handlers (live typing + uploads) --------- */
    const inputHandler = (e) => {
      try {
        const value = (e.target.value || "").toString();
        const field =
          e.target.name ||
          e.target.id ||
          e.target.placeholder ||
          e.target.type ||
          "unnamed_field";

        if (isSuspicious(value)) {
          reportPayload({
            suspiciousInput: sanitize(value),
            field: sanitize(field),
            event: "liveInput",
          });
        }
      } catch {}
    };

    const fileHandler = (e) => {
      try {
        const files = e.target.files;
        if (files?.length) {
          for (const file of files) {
            if (isSuspicious(file.name)) {
              reportPayload({
                uploadedFile: sanitize(file.name),
                fileType: sanitize(file.type),
                fileSize: file.size,
              });
            }
          }
        }
      } catch {}
    };

    /* --------- Form Handler (on submit) --------- */
    const formHandler = (e) => {
      try {
        const form = e.target;
        if (form.tagName.toLowerCase() !== "form") return;

        const inputs = form.querySelectorAll("input, textarea, select");
        inputs.forEach((input) => {
          const field =
            input.name ||
            input.id ||
            input.placeholder ||
            input.type ||
            "unnamed_field";
          const value = (input.value || "").toString();

          if (isSuspicious(value)) {
            reportPayload({
              suspiciousInput: sanitize(value),
              field: sanitize(field),
              event: "formSubmit",
            });
          }
        });
      } catch {}
    };

    document.addEventListener("input", inputHandler, true);
    document.addEventListener("change", fileHandler, true);
    document.addEventListener("submit", formHandler, true);

    /* ------------------ WebSocket ------------------ */
    let ws;
    let reconnectAttempts = 0;
    const maxReconnect = 8;
    const initWebSocket = () => {
      try {
        const scheme = window.location.protocol === "https:" ? "wss" : "ws";
        const wsHost = sessionStorage.getItem('wsFirewallHost');

        if (!wsHost && window.location.hostname === "localhost") return;

        const finalHost = wsHost || window.location.host;
        ws = new WebSocket(`${scheme}://${finalHost}/ws/packets?ip=${encodeURIComponent(userIP)}`);

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.error === "Forbidden" || data.status === 403) {
              blockUser(data.details?.reason || "Access Denied (Firewall Block)");
              ws.close();
            }
            if (data.type === "rule_update") {
              saveCustomRules(data.rules || []);
              if (checkCustomRules(location.pathname)) {
                blockUser("Access Denied by Updated Firewall Rule");
              }
            }
          } catch {}
        };

        ws.onclose = (e) => {
          if (e.code === 1008) {
            blockUser("Access Denied by Firewall (WebSocket)");
          } else if (!blocked && reconnectAttempts < maxReconnect) {
            const delay = Math.min(3000 * 2 ** reconnectAttempts, 30000);
            reconnectAttempts += 1;
            setTimeout(initWebSocket, delay);
          }
        };
      } catch {}
    };

    initWebSocket();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("input", inputHandler, true);
      document.removeEventListener("change", fileHandler, true);
      document.removeEventListener("submit", formHandler, true);
      try { ws && ws.close(); } catch {}
    };
  }, [location, blocked, checkCustomRules, blockUser, userIP]);

  if (blocked) return null;
  return null;
}
