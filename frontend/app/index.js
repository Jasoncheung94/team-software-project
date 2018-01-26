import * as sendJSON from './sendJSON';
import * as checkUserIDCookie from './checkUserIDCookie';


window.onload = () => {
    const existingUser = checkUserIDCookie.checkUserDetails();
    document.getElementById('roll_die').onclick = () => {
        sendJSON.gameStartRequest('cgi-bin/request_dice_roll.py', (req) => {
            if (req.readyState === 4 && req.status === 200) {
                const p = document.createElement('P');
                const t = document.createTextNode(req.responseText);
                p.appendChild(t);
                document.body.appendChild(t);
            }
        });
    };
};
