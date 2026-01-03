// !!! REPLACE THESE TWO VALUES !!!
const CLIENT_ID = '872552222655-gu78ic30706c6164v8st2hu67vj36vhn.apps.googleusercontent.com';
const PROJECT_ID = 'recipes-46d2e';



const initGis = () => {
    const cachedToken = localStorage.getItem('bq_token');
    const tokenTime = localStorage.getItem('bq_token_time');
    const oneHour = 3600 * 1000;
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/bigquery.readonly',
        callback: (resp) => {
            if (resp.access_token) {
                localStorage.setItem('bq_token', resp.access_token);
                localStorage.setItem('bq_token_time', Date.now())
                isLoggedIn.value = true;
                executeTemplate();
            } else if (resp.error === 'interaction_required') {
                // This is expected if the user needs to click a button
                console.log("Silent auth failed: User interaction required.");
                isLoggedIn.value = false;
            }
        },
    });
    console.log(cachedToken)
    console.log(Date.now())
    console.log(tokenTime)
    if (cachedToken && (Date.now() - tokenTime < oneHour)) {
        // Token is still fresh! No popup needed.
        console.log('win')
        isLoggedIn.value = true;
        executeTemplate();
    } else {
        // Token is missing or expired. 
        // We MUST ask the user to click the button or try one silent check.
        tokenClient.requestAccessToken({ prompt: 'none' });
    }
};