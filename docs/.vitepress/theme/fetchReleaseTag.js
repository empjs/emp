import { onMounted } from 'vue'
import pkg from '../../../packages/emp/package.json'
export default function fetchReleaseTag() {
    onMounted(() => {
        const mainTitle = document.getElementById('main-title')
    console.log('mainTitle',mainTitle)
        mainTitle.style.position = 'relative'
        const docsReleaseTag = document.createElement('span')
        docsReleaseTag.classList.add('release-tag')
        const releaseTagName = `v${pkg.version}`
        docsReleaseTag.innerText = releaseTagName
        mainTitle.appendChild(docsReleaseTag)
    });
}