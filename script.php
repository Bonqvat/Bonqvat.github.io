<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'futureauto';
$user = 'postgres';
$password = 'your_password';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getCars':
        getCars($pdo);
        break;
    case 'addFeedback':
        addFeedback($pdo);
        break;
    case 'getUserData':
        getUserData($pdo);
        break;
    case 'updateUserData':
        updateUserData($pdo);
        break;
    case 'loginUser':
        loginUser($pdo);
        break;
    case 'registerUser':
        registerUser($pdo);
        break;
    case 'addToCart':
        addToCart($pdo);
        break;
    case 'removeFromCart':
        removeFromCart($pdo);
        break;
    case 'getCart':
        getCart($pdo);
        break;
    case 'addToFavorites':
        addToFavorites($pdo);
        break;
    case 'removeFromFavorites':
        removeFromFavorites($pdo);
        break;
    case 'getFavorites':
        getFavorites($pdo);
        break;
    case 'placeOrder':
        placeOrder($pdo);
        break;
    case 'getFeedback':
        getFeedback($pdo);
        break;
    case 'deleteFeedback':
        deleteFeedback($pdo);
        break;
    case 'updateFeedbackStatus':
        updateFeedbackStatus($pdo);
        break;
    case 'getDashboardData':
        getDashboardData($pdo);
        break;
    case 'getAdminOrders':
        getAdminOrders($pdo);
        break;
    case 'deleteOrder':
        deleteOrder($pdo);
        break;
    case 'completeOrder':
        completeOrder($pdo);
        break;
    case 'getOrders':
        getOrders($pdo);
        break;
    case 'getTickets':
        getTickets($pdo);
        break;
    case 'createTicket':
        createTicket($pdo);
        break;
    case 'getOrderDetails':
        getOrderDetails($pdo);
        break;
    case 'repeatOrder':
        repeatOrder($pdo);
        break;
    case 'cancelOrder':
        cancelOrder($pdo);
        break;
    case 'uploadAvatar':
        uploadAvatar($pdo);
        break;
    case 'logout':
        logout();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function getCars($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT 
                id, brand, model, year, price, description, 
                body_type AS bodyType, 
                drive, 
                features, 
                images, 
                specs,
                power,
                status,
                created_at AS createdAt
            FROM cars 
            ORDER BY created_at DESC
        ");
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($cars as &$car) {
            if (isset($car['bodytype'])) {
                $car['bodyType'] = $car['bodytype'];
                unset($car['bodytype']);
            }
            if (isset($car['createdat'])) {
                $car['createdAt'] = $car['createdat'];
                unset($car['createdat']);
            }
        }
        echo json_encode($cars);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function addFeedback($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['name', 'phone', 'email', 'subject', 'message'];
    foreach ($required as $field) {
        if (empty($data[$field] ?? '')) {
            echo json_encode(['error' => "Поле $field обязательно для заполнения"]);
            return;
        }
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO feedback (name, phone, email, subject, message, service_type) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['name'],
            $data['phone'],
            $data['email'],
            $data['subject'],
            $data['message'],
            $data['type'] ?? null
        ]);
        
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getUserData($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    try {
        $stmt = $pdo->prepare("SELECT id, email, name, phone, address, last_login, avatar_path, is_admin FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode($user);
        } else {
            echo json_encode(['error' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateUserData($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $type = $data['type'] ?? '';

    try {
        switch ($type) {
            case 'personal':
                $name = $data['name'] ?? '';
                $phone = $data['phone'] ?? '';
                $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?");
                $stmt->execute([$name, $phone, $userId]);
                break;
            case 'address':
                $address = $data['address'] ?? '';
                $stmt = $pdo->prepare("UPDATE users SET address = ? WHERE id = ?");
                $stmt->execute([$address, $userId]);
                break;
            case 'security':
                $currentPassword = $data['currentPassword'] ?? '';
                $newPassword = $data['newPassword'] ?? '';
                $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                if (!$user || !password_verify($currentPassword, $user['password'])) {
                    echo json_encode(['error' => 'Current password is incorrect']);
                    return;
                }
                $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->execute([$hashedPassword, $userId]);
                break;
            default:
                echo json_encode(['error' => 'Invalid update type']);
                return;
        }
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function loginUser($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, email, name, password, is_admin FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }

        $_SESSION['user_id'] = $user['id'];
        
        $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);

        echo json_encode([
            'success' => true, 
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'isAdmin' => (bool)$user['is_admin']
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function registerUser($pdo) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    
    if (empty($email) || empty($password) || empty($name)) {
        echo json_encode(['error' => 'Email, password, and name are required']);
        return;
    }

    $avatarPath = null;
    if (!empty($_FILES['avatar']['tmp_name'])) {
        $targetDir = "avatars/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        
        $fileExt = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        $newFilename = 'avatar_' . uniqid() . '.' . $fileExt;
        $targetFile = $targetDir . $newFilename;
        
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $fileType = mime_content_type($_FILES['avatar']['tmp_name']);
        
        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
                $avatarPath = $targetFile;
            } else {
                echo json_encode(['error' => 'Error uploading avatar']);
                return;
            }
        } else {
            echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, GIF allowed.']);
            return;
        }
    }

    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Email already registered']);
            return;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("
            INSERT INTO users (email, password, name, phone, address, avatar_path, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $email, 
            $hashedPassword, 
            $name, 
            $phone, 
            $address,
            $avatarPath
        ]);
        $userId = $pdo->lastInsertId();

        $_SESSION['user_id'] = $userId;

        echo json_encode(['success' => true, 'userId' => $userId]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23505) {
            echo json_encode(['error' => 'Email already registered']);
        } else {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

function addToCart($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("SELECT id FROM cart WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'message' => 'Already in cart']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO cart (user_id, car_id) VALUES (?, ?)");
        $stmt->execute([$userId, $carId]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function removeFromCart($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        $count = $stmt->rowCount();
        if ($count > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Item not found in cart']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getCart($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("
            SELECT c.id, c.brand, c.model, c.year, c.price, c.images 
            FROM cart 
            JOIN cars c ON cart.car_id = c.id 
            WHERE cart.user_id = ?
        ");
        $stmt->execute([$userId]);
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($cartItems as &$item) {
            if (isset($item['images'])) {
                $item['images'] = json_decode($item['images'], true);
            }
        }
        echo json_encode($cartItems);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function addToFavorites($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'message' => 'Already in favorites']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO favorites (user_id, car_id) VALUES (?, ?)");
        $stmt->execute([$userId, $carId]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function removeFromFavorites($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        $count = $stmt->rowCount();
        if ($count > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Item not found in favorites']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getFavorites($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("
            SELECT c.id, c.brand, c.model, c.year, c.price, c.images 
            FROM favorites 
            JOIN cars c ON favorites.car_id = c.id 
            WHERE favorites.user_id = ?
        ");
        $stmt->execute([$userId]);
        $favItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($favItems as &$item) {
            if (isset($item['images'])) {
                $item['images'] = json_decode($item['images'], true);
            }
        }
        echo json_encode($favItems);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function placeOrder($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id'];
    
    if (empty($data['carId']) || empty($data['dealer']) || empty($data['totalPrice'])) {
        echo json_encode(['error' => 'Missing required data']);
        return;
    }

    try {
        $carStmt = $pdo->prepare("
            SELECT id, brand, model, year, price 
            FROM cars WHERE id = ?
        ");
        $carStmt->execute([$data['carId']]);
        $car = $carStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$car) {
            echo json_encode(['error' => 'Car not found']);
            return;
        }

        $stmt = $pdo->prepare("
            INSERT INTO orders (
                user_id, car_id, car_brand, car_model, car_year, car_price,
                services, options, dealer, total_price, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            RETURNING id
        ");
        
        $services = $data['services'] ?? [];
        $options = $data['options'] ?? [];
        
        $stmt->execute([
            $userId,
            $car['id'],
            $car['brand'],
            $car['model'],
            $car['year'],
            $car['price'],
            json_encode($services),
            json_encode($options),
            $data['dealer'],
            $data['totalPrice']
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $orderId = $result['id'] ?? null;
        
        echo json_encode(['success' => true, 'orderId' => $orderId]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getFeedback($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM feedback ORDER BY created_at DESC");
        $feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($feedback);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteFeedback($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM feedback WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateFeedbackStatus($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $status = $data['status'] ?? null;

    if (!$id || !$status) {
        echo json_encode(['error' => 'ID and status required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE feedback SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getDashboardData($pdo) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) FROM feedback WHERE status = 'new'");
        $newFeedback = (int)$stmt->fetchColumn();
        
        $stmt = $pdo->query("SELECT COUNT(*) FROM cars");
        $totalCars = (int)$stmt->fetchColumn();
        
        $stmt = $pdo->query("SELECT COUNT(*) FROM users");
        $totalUsers = (int)$stmt->fetchColumn();
        
        $stmt = $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'Ожидает подтверждения'");
        $newOrders = (int)$stmt->fetchColumn();
        
        echo json_encode([
            'new_feedback' => $newFeedback,
            'total_cars' => $totalCars,
            'total_users' => $totalUsers,
            'new_orders' => $newOrders
        ]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getAdminOrders($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT o.*, u.name AS user_name 
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteOrder($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function completeOrder($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['error' => 'ID required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = 'Выполнен' WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getOrders($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    
    try {
        $sql = "SELECT 
                o.id, 
                o.created_at AS date, 
                o.status, 
                o.total_price,
                c.brand, 
                c.model, 
                c.year,
                (c.images->>0) AS image,
                (c.specs->>'engine') AS engine,
                (c.specs->>'transmission') AS transmission,
                c.drive
            FROM orders o
            JOIN cars c ON o.car_id = c.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC";
            
        if ($limit) {
            $sql .= " LIMIT $limit";
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $formattedOrders = [];
        foreach ($orders as $order) {
            $formattedOrders[] = [
                'id' => $order['id'],
                'date' => $order['date'],
                'status' => $order['status'],
                'total_price' => (int)$order['total_price'],
                'car' => [
                    'brand' => $order['brand'],
                    'model' => $order['model'],
                    'year' => (int)$order['year'],
                    'image' => $order['image'],
                    'engine' => $order['engine'],
                    'transmission' => $order['transmission'],
                    'drive' => $order['drive']
                ]
            ];
        }
        
        echo json_encode($formattedOrders);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getTickets($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    
    try {
        $userStmt = $pdo->prepare("SELECT email FROM users WHERE id = ?");
        $userStmt->execute([$userId]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || empty($user['email'])) {
            echo json_encode(['error' => 'User email not found']);
            return;
        }
        
        $email = $user['email'];
        
        $stmt = $pdo->prepare("
            SELECT 
                id, 
                subject, 
                message, 
                status, 
                created_at
            FROM feedback
            WHERE email = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$email]);
        $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($tickets);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function createTicket($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id'];
    
    $subject = $data['subject'] ?? '';
    $message = $data['message'] ?? '';
    
    if (empty($subject) || empty($message)) {
        echo json_encode(['error' => 'Subject and message are required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO feedback (user_id, subject, message, status, created_at)
            VALUES (?, ?, ?, 'new', NOW())
        ");
        $stmt->execute([$userId, $subject, $message]);
        
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getOrderDetails($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    $orderId = $_GET['order_id'] ?? null;
    
    if (!$orderId) {
        echo json_encode(['error' => 'Order ID required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                o.*, 
                (c.images->>0) AS image,
                c.specs,
                c.drive
            FROM orders o
            JOIN cars c ON o.car_id = c.id
            WHERE o.id = ? AND o.user_id = ?
        ");
        $stmt->execute([$orderId, $userId]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($order) {
            $formattedOrder = [
                'id' => $order['id'],
                'status' => $order['status'],
                'created_at' => $order['created_at'],
                'total_price' => (int)$order['total_price'],
                'dealer' => $order['dealer'],
                'car' => [
                    'brand' => $order['car_brand'],
                    'model' => $order['car_model'],
                    'year' => (int)$order['car_year'],
                    'price' => (int)$order['car_price'],
                    'image' => $order['image'],
                    'specs' => $order['specs'],
                    'drive' => $order['drive']
                ],
                'services' => json_decode($order['services'], true) ?: [],
                'options' => json_decode($order['options'], true) ?: []
            ];
            
            echo json_encode($formattedOrder);
        } else {
            echo json_encode(['error' => 'Order not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function repeatOrder($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id'];
    $orderId = $data['order_id'] ?? null;
    
    if (!$orderId) {
        echo json_encode(['error' => 'Order ID required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT car_id FROM orders 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$orderId, $userId]);
        $order = $stmt->fetch();
        
        if (!$order) {
            echo json_encode(['error' => 'Order not found']);
            return;
        }
        
        $carId = $order['car_id'];
        
        $stmt = $pdo->prepare("
            INSERT INTO cart (user_id, car_id)
            VALUES (?, ?)
            ON CONFLICT (user_id, car_id) DO NOTHING
        ");
        $stmt->execute([$userId, $carId]);
        
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function cancelOrder($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id'];
    $orderId = $_GET['order_id'] ?? null;
    
    if (!$orderId) {
        echo json_encode(['error' => 'Order ID required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE orders
            SET status = 'Отменен'
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$orderId, $userId]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Order cannot be canceled']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function uploadAvatar($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    $targetDir = "avatars/";
    
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == UPLOAD_ERR_OK) {
        $file = $_FILES['avatar'];
        
        $fileType = mime_content_type($file['tmp_name']);
        $allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($fileType, $allowed)) {
            echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, GIF allowed.']);
            return;
        }
        
        // Получаем старый путь аватарки
        $stmt = $pdo->prepare("SELECT avatar_path FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $oldAvatar = $stmt->fetchColumn();
        
        // Удаляем старую аватарку, если она существует
        if ($oldAvatar && file_exists($oldAvatar)) {
            unlink($oldAvatar);
        }
        
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newName = 'avatar_' . $userId . '_' . time() . '.' . $ext;
        $targetFile = $targetDir . $newName;

        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            $stmt = $pdo->prepare("UPDATE users SET avatar_path = ? WHERE id = ?");
            $stmt->execute([$targetFile, $userId]);
            
            echo json_encode(['success' => true, 'avatarPath' => $targetFile]);
        } else {
            echo json_encode(['error' => 'Error uploading file']);
        }
    } else {
        echo json_encode(['error' => 'No file uploaded']);
    }
}

function logout() {
    session_start();
    $_SESSION = array();
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}
?>