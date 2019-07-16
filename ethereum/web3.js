
import Web3 from 'web3';

// Making a big assumption.. that Metamask has injected a provider
// Into the page already..
// const web3 = new Web3(window.web3.currentProvider);

let web3;
const infuraAPIKey = ''; // Provide infura API key here *******

if ( typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ) {
    // We are running in the BROWSER.. Metamask IS present
    // We will create our own copy of Web3, using Metamasks provider
    // We do this so that we know we are always using the same version of Web3
    // Since the version injected by Metamask could be any version.. we don't know
    web3 = new Web3(window.web3.currentProvider);

} else {
    // We are on the SERVER *OR* the user is NOT using Metamask
    // Access the Infura node we signed up to for a provider instead of
    // the Metamask one.
    const provider = new Web3.providers.HttpProvider(infuraAPIKey);

    web3 = new Web3(provider);
}


// Export an instance of Web3
export default web3;
