
import bodyParser from 'body-parser';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';


const PORT = process.env.PORT ?? 3000
const app = express();


app.use(cors());
app.use(bodyParser.json());

const databaseLogs = {
  host: 'localhost',
  user: 'root',
  password: '624848(((((Kk',
  database: 'prihodko'
}
const tables = {
  advantages: 'advantages',
  schedules: 'schedules',
  contacts: 'contacts',
  users: 'users'
}
const connection = mysql.createConnection(databaseLogs)

connection.connect((error) => {
  if (error) {
    console.log('Ошибка соединения с базой данных')
    throw error;
  }
  console.log('Успешное соединение с базой данных')

});


app.get("/", (req, res) => {
  connection.query(`SELECT * FROM ${tables.advantages}`, (error, data) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.send(data);
  })
})

app.get("/schedules", (req, res) => {
  connection.query(`SELECT * FROM ${tables.schedules}`, (error, data) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.send(data);
  })
})

app.get("/contacts", (req, res) => {
  connection.query(`SELECT * FROM ${tables.contacts}`, (error, data) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.send(data);
  })
})
app.get('/products', (req, res) => {
  const sql = `
      SELECT
        products.id as product_id,
        products.name  as product_name,
        products.icon  as product_icon,
        products.image as product_image,
        products.first_day as product_firstday,
        products.second_day  as product_secondday,
        products.price as  product_price,
        params.name  as param,
        products_params.value as param_value 
        FROM prihodko.products
        INNER JOIN 
            prihodko.products_params ON products.id = products_params.product_id
        INNER JOIN 
            prihodko.params ON products_params.param_id = params.id;
    `;

  connection.query(sql, (err, data) => {
    if (err) throw err;

    const result = {};

    data.forEach(row => {
      const { product_id, product_name, product_icon, product_image, product_firstday, product_secondday, product_price, param, param_value } = row;

      if (!result[product_id]) {
        result[product_id] = {
          id: product_id,
          name: product_name,
          icon: product_icon,
          image: product_image,
          first_day: product_firstday,
          second_day: product_secondday,
          price: product_price,
          params: []
        };
      }

      result[product_id].params.push({ param, value: param_value });
    });

    res.json(Object.values(result));

  });
});
app.post('/register', async (req, res) => {
  const { username, password, policy } = req.body;
  console.log('Тело запроса:', req)

  // Валидация данных
  if (!username || !password) {
    return res.status(400).json({ error: 'Имя пользователя и пароль обязательны.' });
  }
  if (!policy) {
    return res.status(400).json({ error: 'Нам нужно ваше согласие на обработку персональных данных' });
  }

  try {
    // Проверяем, существует ли уже такой пользователь
    connection.query('SELECT * FROM users WHERE name = ?', [username], async (err, results) => {
      if (err) {
        console.error('Ошибка при проверке пользователя в базе:', err);
        return res.status(500).json({ error: 'Ошибка базы данных.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Пользователь с таким именем уже существует.' });
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Вставляем нового пользователя в базу
      connection.query('INSERT INTO users (name, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Ошибка при добавлении пользователя:', err);
          return res.status(500).json({ error: 'Ошибка при добавлении пользователя.' });
        }

        // Ответ отправляется только один раз
        return res.status(201).json({ message: 'Пользователь успешно зарегистрирован!' });
      });
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ error: "Имя пользователь и пароль обязательны." })
  }
  try {
    connection.query('SELECT * FROM users WHERE name = ?', [username], async (err, result) => {
      if (err) {
        return res.status(400).json({ error: 'Ошибка при попытке взять значение из базы данных' })
      }
      console.log(result);
      if (result.length === 0) {
        return res.status(400).json({ error: 'Пользователь не найден' })
      }
      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Неверный пароль" })
      }
      const token = jwt.sign({ userId: user.id, username: user.name }, 'secretKey', {
        expiresIn: '1h' // Токен действует 1 час
      });
      return res.status(200).json({ token });
    })
  }
  catch (error) {
    console.error('Ошибка при авторизации:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }

})

app.post('/comments', async (req, res) => {
  const { estimation, comment, name, tel, privacy } = req.body;
  const regex = /^\+7 \(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
  const errors = {
    estimation: "Вам нужно оценить нас)",
    comment: "Вы не заполнили поле \"Ваш отзыв\"",
    name: "Пожалуйста, заполните поле \"Имя\"",
    tel: "Нам нужен ваш номер телефона, чтобы мы могли связаться с вами",
    telRegex: "Вы не до конца ввели номер телефона",
    privacy: "Нам необходимо ваше согласие на Обработку персональных данных"
  }

  if (!estimation) return res.status(400).json({ error: errors.estimation });
  if (!comment) return res.status(400).json({ error: errors.comment });
  if (!name) return res.status(400).json({ error: errors.name });
  if (!tel) return res.status(400).json({ error: errors.tel });
  if (!privacy) return res.status(400).json({ error: errors.privacy });
  if (!tel.match(regex)) return res.status(400).json({ error: errors.telRegex });

  try {
    connection.query('INSERT INTO comments (estimation, comment, name, tel) VALUES (?, ?, ?, ?)', [estimation, comment, name, tel], ((err, result) => {
      if (err) {
        console.error("Ошибка при запросе к базе данных:", err);
        return res.status(400).json({ error: "Ошибка при запросе к базе данных" })
      }
      return res.status(201).json({ message: "Ваш комментарий был успешно добавлен!" })
    }))
  } catch (err) {
    console.error("Техническая ошибка:", err); // Логирование технической ошибки
    return res.status(400).json({ error: "Технические шоколадки :)" })
  }
})

app.post('/cart', async (req, res) => {
  const { cart_id, user_id, product_id, quantity } = req.body;
  try {
    connection.query('SELECT * FROM carts WHERE user_id = ? AND cart_id = ? AND product_id = ?', [user_id, cart_id, product_id], (err, data) => {
      if (data.length > 0) {
        connection.query('UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND cart_id = ? AND product_id = ? ', [quantity, user_id, cart_id, product_id])
        return res.status(201).json({ message: 'Товар был успешно обновлен!' })
      }
      else {
        connection.query('INSERT INTO carts (cart_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)', [cart_id, user_id, product_id, quantity]);
        return res.status(201).json({ message: 'Товар был успешно добавлен в корзину!' })
      }
    });




  }
  catch (error) {
    console.error('Ошибка при работе с базой данных:', error);
    return res.status(400).json({ error: "Ошибка добавления товара в корзину" })
  }
})

app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `   SELECT 
    carts.cart_id as cart_id,
    carts.user_id as user_id,
    carts.product_id as product_id,
    carts.quantity   as product_quantity,
    products.id as product_id,
    products.name as product_name,
    products.image as product_image,
    products.price as product_price
    FROM carts
    INNER JOIN products ON carts.product_id=products.id
    WHERE carts.user_id = ?`
  try {
    connection.query(sql, [userId], (err, data) => {
      if (err) {
        console.log('Ошибка при запросе к базе')
      }
      return res.json(data);
    })
  }
  catch (error) {
    console.log('Внутрення ошибка сервера')
  }
})

app.patch('/cart/', (req, res) => {
  const { user_id, product_id, product_quantity } = req.body;
  const sql = `UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?`;
  try {
    connection.query(sql, [product_quantity, user_id, product_id], (err, data) => {
      if (err) {
        console.log('Ошибка при запросе к базе')
      }
      return res.json(data);
    })
  }
  catch (error) {
    console.log('Внутрення ошибка сервера')
  }
})
app.delete('/cart', (req, res) => {
  const { user_id, product_id } = req.query;
  const sql = 'DELETE FROM carts WHERE user_id = ? AND product_id = ?';

  connection.query(sql, [user_id, product_id], (err) => {
    if (err) {
      return res.status(400).json({ error: "Ошибка при удалении товара" });
    }
    return res.status(201).json("Товар был успешно удален!");
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})