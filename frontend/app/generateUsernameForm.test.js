import * as usernameForm from './generateUsernameForm';
import * as random from './random';

describe('Request sent on function call', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    // Create a mock XMLHttpRequest object
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Assign the global window XMLHttpRequest to point to the mockXHR object
    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('should request userID', (done) => {
        const callbackfn = jest.fn();
        const mockServerAddress = random.string(5);
        usernameForm.requestUserID(mockServerAddress, 'name', callbackfn);
        expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress, true);
        expect(callbackfn).not.toHaveBeenCalled();
        mockXHR.onreadystatechange();
        expect(callbackfn).toHaveBeenCalledWith(mockXHR);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({username: 'name'}));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });
});

describe('Generate form to the body of ', () => {
    test('if generated form is successful ', (done) => {
        const callback = jest.fn();
        usernameForm.generateUsernameForm(callback);
        expect(document.getElementById('submit_username').value).toEqual('Submit');
        expect(document.body.innerHTML).toEqual('<form><label for="username">Enter Username</label><input type="text" id="username"><input type="submit" value="Submit" id="submit_username" disabled=""><span id="checker"></span></form>');
        expect(document.getElementById('username').type).toEqual('text');
        done();
    });
});
