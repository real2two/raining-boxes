function endGame() {
    stayedAliveFor = timer();
    gameEnded = true;

    gameStarted = null;

    if (!audioTrack.paused) audioTrack.stop();
}