Feature: Test cinema site
    Scenario: Should book one chair
        Given user is on cinema hall page
        When user selects one free chair
        Then user get the QR with selector "ticket__info-qr"
    Scenario: Should book THREE chairs
        Given user is on cinema hall page
        When user selects three free chairs
        Then user get the QR with selector "ticket__info-qr" and 3 places
    Scenario: Shouldn't book one chair twice
        Given user is on cinema hall page
        When user selects one free chair
        When user get the QR
        When user return to cinema hall
        When user selects same chair
        Then user can't book and chair selector is "buying-scheme__chair_taken"
