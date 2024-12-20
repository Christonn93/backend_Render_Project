### **Lesson 7: Pagination and Filtering**

#### Objectives

1. Add pagination to your API endpoints.
2. Implement filtering to allow searching and data retrieval based on specific criteria.
3. Combine pagination and filtering for enhanced API usability.

---

### **1. Add Pagination**

Pagination limits the number of items returned in a single API response and provides mechanisms to request additional pages.

#### Example: Paginate the `/users` Endpoint

Update the `GET /users` route in `user.route.ts`:

```typescript
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1; // Current page
    const limit = parseInt(req.query.limit as string) || 10; // Items per page
    const skip = (page - 1) * limit;

    const [users, total] = await userRepository.findAndCount({
        skip: skip,
        take: limit,
    });

    res.json({
        total, // Total number of items
        page, // Current page
        limit, // Items per page
        data: users, // Paginated data
    });
});
```

#### Test Pagination

- **Request**:

  ```
  GET /users?page=2&limit=5
  ```

- **Response**:

  ```json
  {
      "total": 100,
      "page": 2,
      "limit": 5,
      "data": [
          { "id": 6, "name": "User 6", "email": "user6@example.com" },
          ...
      ]
  }
  ```

---

### **2. Add Filtering**

Filtering allows clients to retrieve data based on specific criteria.

#### Example: Filter Users by Name or Email

Update the `GET /users` route:

```typescript
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || ''; // Search term
    const [users, total] = await userRepository.findAndCount({
        where: [
            { name: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
        ],
        skip: skip,
        take: limit,
    });

    res.json({
        total,
        page,
        limit,
        data: users,
    });
});
```

#### Test Filtering

- **Request**:

  ```
  GET /users?search=john
  ```

- **Response**:

  ```json
  {
      "total": 2,
      "page": 1,
      "limit": 10,
      "data": [
          { "id": 1, "name": "John Doe", "email": "john.doe@example.com" },
          { "id": 3, "name": "Johnny Appleseed", "email": "johnny@example.com" }
      ]
  }
  ```

---

### **3. Combine Pagination and Filtering**

You can combine pagination and filtering to provide clients with both capabilities in a single endpoint.

#### Final Combined Route

Here’s the complete implementation of `GET /users`:

```typescript
import { Like } from 'typeorm';

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || ''; // Search term
    const [users, total] = await userRepository.findAndCount({
        where: [
            { name: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
        ],
        skip: skip,
        take: limit,
    });

    res.json({
        total,
        page,
        limit,
        data: users,
    });
});
```

---

### **4. Optional: Add Sorting**

You can add sorting functionality by accepting a `sort` parameter.

#### Update Route to Handle Sorting

```typescript
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || ''; // Search term
    const sort = req.query.sort || 'name'; // Default sort by name
    const order = (req.query.order as 'ASC' | 'DESC') || 'ASC'; // Default order ascending

    const [users, total] = await userRepository.findAndCount({
        where: [
            { name: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
        ],
        skip: skip,
        take: limit,
        order: { [sort]: order },
    });

    res.json({
        total,
        page,
        limit,
        sort,
        order,
        data: users,
    });
});
```

#### Test Sorting

- **Request**:

  ```
  GET /users?sort=email&order=DESC
  ```

- **Response**:

  ```json
  {
      "total": 100,
      "page": 1,
      "limit": 10,
      "sort": "email",
      "order": "DESC",
      "data": [
          { "id": 50, "name": "User 50", "email": "zebra@example.com" },
          ...
      ]
  }
  ```

---

### **What You Learned in Lesson 7**

- Implemented pagination using `page` and `limit` query parameters.
- Added filtering based on search terms using the `Like` operator.
- Combined pagination, filtering, and sorting for a flexible API.

---

### **Assignment**

1. Add pagination, filtering, and sorting to the `/products` endpoint.
2. Implement filtering on the `price` field in `/products` to allow searching for products within a price range.
