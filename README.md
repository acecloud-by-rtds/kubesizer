# KubeSizer static Tailwind site

Open `index.html` directly after extracting the ZIP. Internal links and local JavaScript use relative paths so local file navigation works. Tailwind loads from the official CDN, so an internet connection is required for styling when previewing raw HTML files.

Included pages:
- Homepage
- Tools hub
- Node & Pod Sizing Calculator
- Requests & Limits Calculator
- HPA Calculator
- Kubernetes Cluster Cost Calculator
- Kubernetes Version Checker
- Guides hub
- 25 long-form Kubernetes guides
- About
- Contact / Suggest a Tool

Support: support@kubesizer.com

## Guide URL structure

Individual guides are stored directly inside the `guides` folder as HTML files. Example:

`guides/kubernetes-cpu-throttling.html`

This produces URLs such as `/guides/kubernetes-cpu-throttling.html` on static hosting platforms such as Vercel.
