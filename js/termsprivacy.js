function initTermsPrivacyPage() {
    function openTab(tabName) {
        const tabContents = document.getElementsByClassName('terms-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        
        const tabs = document.getElementsByClassName('tab');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }
        
        document.getElementById(tabName).classList.add('active');
        
        if (window.event) {
            window.event.currentTarget.classList.add('active');
        } else {
            const tabIndex = tabName === 'terms' ? 0 : 1;
            if (tabs[tabIndex]) tabs[tabIndex].classList.add('active');
        }
    }
    
    window.openTab = openTab;
    updateHeaderCounters();
    
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'privacy') {
        openTab('privacy');
    } else {
        openTab('terms');
    }
}

window.initTermsPrivacyPage = initTermsPrivacyPage;