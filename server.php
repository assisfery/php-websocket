<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

    // Make sure composer dependencies have been installed
    require __DIR__ . '/vendor/autoload.php';

/**
 * chat.php
 * Send any incoming messages to all connected clients (except sender)
 */
class MyChat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);

        echo "\nNew Connection";
    }

    public function onMessage(ConnectionInterface $from, $msg) {

        $message = json_decode($msg);

        // when new user login/connect
        // add its name to socket object
        if($message->action == "login")
        {
            $from->username = $message->content;
        }

        $message->username = $from->username;

        echo "\nMessage: " . json_encode($message);

        foreach ($this->clients as $client) {
            //if ($from != $client)
           //$client->send($msg);

            $client->send(json_encode($message));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "\nClose Connection";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
    }
}

$app = new Ratchet\App('localhost', 8080);
$app->route('/chat', new MyChat, array('*'));
//$app->route('/echo', new Ratchet\Server\EchoServer, array('*'));
$app->run();
