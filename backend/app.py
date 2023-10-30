from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt

app = Flask(__name__)
app.config['DEBUG'] = True

app.config['JWT_SECRET_KEY'] = 'DeepLinkSecretKey'  # Replace 'your-secret-key' with a secure secret key
jwt = JWTManager(app)

# Enable CORS for all routes
CORS(app)

# Function to initialize the SQLite3 database
def create_tables():
    conn = sqlite3.connect('deeplink.db')
    cursor = conn.cursor()

    # Create department_details table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS department_details (
            department_details_id INTEGER PRIMARY KEY,
            department_name TEXT NOT NULL UNIQUE,
            department_type TEXT NOT NULL,
            department_description TEXT NOT NULL,
            department_head TEXT NOT NULL,
            department_email TEXT NOT NULL,
            department_phone TEXT NOT NULL,
            department_address TEXT NOT NULL,
            department_uid TEXT NOT NULL
        )
    ''')

    # Create personal_details table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS personal_details (
            personal_details_id INTEGER PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            dob TEXT NOT NULL,
            personal_address TEXT NOT NULL,
            designation TEXT NOT NULL,
            department_details_id INTEGER,
            FOREIGN KEY (department_details_id) REFERENCES department_details (department_details_id)
        )
    ''')

    # Create user_login_info table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_login_info (
            user_login_info_id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            personal_details_id INTEGER,
            FOREIGN KEY (personal_details_id) REFERENCES personal_details (personal_details_id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_details (
            project_id INTEGER PRIMARY KEY,
            project_name TEXT NOT NULL UNIQUE,
            department_name TEXT NOT NULL,
            project_description TEXT NOT NULL,
            project_budget REAL NOT NULL,
            project_start_date TEXT NOT NULL,
            project_end_date TEXT NOT NULL,
            project_status TEXT NOT NULL,
            project_location TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            department_details_id INTEGER,
            FOREIGN KEY (department_details_id) REFERENCES department_details (department_details_id)
        )
    ''')

    conn.commit()
    conn.close()

create_tables()


# Register API endpoint
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    department_name = data['department_name']
    department_type = data['department_type']
    department_description = data['department_description']
    department_head = data['department_head']
    department_email = data['department_email']
    department_phone = data['department_phone']
    department_address = data['department_address']
    department_uid = data['department_uid']
    first_name = data['first_name']
    last_name = data['last_name']
    dob = data['dob']
    personal_address = data['personal_address']
    designation = data['designation']
    username = data['username']
    email = data['email']
    password = data['password']
    
    print("Received Data:", data)

    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        # Insert data into department_details table
        cursor.execute('''
            INSERT INTO department_details (department_name, department_type, department_description, department_head, department_email, department_phone, department_address, department_uid)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (department_name, department_type, department_description, department_head, department_email, department_phone, department_address, department_uid))

        # Retrieve the department_details_id of the inserted department_details row
        department_details_id = cursor.lastrowid

        # Insert data into personal_details table with the department_details_id as the foreign key
        cursor.execute('''
            INSERT INTO personal_details (first_name, last_name, dob, personal_address, designation, department_details_id)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, dob, personal_address, designation, department_details_id))

        # Retrieve the personal_details_id of the inserted personal_details row
        personal_details_id = cursor.lastrowid

        # Insert data into user_login_info table with the personal_details_id as the foreign key
        cursor.execute('''
            INSERT INTO user_login_info (username, email, password, personal_details_id)
            VALUES (?, ?, ?, ?)
        ''', (username, email, hashed_password.decode('utf-8'), personal_details_id))

        conn.commit()
        conn.close()

        return jsonify({"status": True, "message": "Registration successful"}), 200
    except Exception as e:
        return jsonify({"status": False, "message": "Registration failed", "error": str(e)}), 500

# Login API endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data['username']
    email = data['email']
    password = data['password']

    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        # Retrieve user_login_info data
        cursor.execute('''
            SELECT * FROM user_login_info
            WHERE username=? AND email=?
        ''', (username, email))
        user_login_info_row = cursor.fetchone()

        if user_login_info_row and bcrypt.checkpw(password.encode('utf-8'), user_login_info_row[3].encode('utf-8')):
            personal_details_id = user_login_info_row[4]

            # Retrieve personal_details data
            cursor.execute('''
                SELECT * FROM personal_details
                WHERE personal_details_id = ?
            ''', (personal_details_id,))
            personal_details_row = cursor.fetchone()

            if personal_details_row:
                department_details_id = personal_details_row[6]

                # Retrieve department_details data
                cursor.execute('''
                    SELECT * FROM department_details
                    WHERE department_details_id = ?
                ''', (department_details_id,))
                department_details_row = cursor.fetchone()

                if department_details_row:
                    # Combine the data from all three tables
                    user_data = {
                        "department_name": department_details_row[1],
                        "department_type": department_details_row[2],
                        "department_description": department_details_row[3],
                        "department_head": department_details_row[4],
                        "department_email": department_details_row[5],
                        "department_phone": department_details_row[6],
                        "department_address": department_details_row[7],
                        "department_uid": department_details_row[8],
                        "first_name": personal_details_row[1],
                        "last_name": personal_details_row[2],
                        "dob": personal_details_row[3],
                        "personal_address": personal_details_row[4],
                        "designation": personal_details_row[5],
                        "username": username,
                        "email": email,
                    }

                    # Create a JWT token
                    access_token = create_access_token(identity=username)

                    # Include the entire user object in the response
                    response_data = {
                        "status": True,
                        "message": "Login successful",
                        "access_token": access_token,
                        "user": user_data
                    }

                    conn.close()
                    return jsonify(response_data), 200
                else:
                    conn.close()
                    return jsonify({"status": False, "message": "Department details not found."}), 404
            else:
                conn.close()
                return jsonify({"status": False, "message": "Personal details not found."}), 404
        else:
            conn.close()
            return jsonify({"status": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"status": False, "message": "Login failed", "error": str(e)}), 500


# Protected route example
@app.route('/api/protected', methods=['GET'])
@jwt_required()  # Require JWT token for accessing this endpoint
def protected_route():
    current_user = get_jwt_identity()
    return jsonify({"status": True, "message": "This is a protected route", "user": current_user}), 200

# API endpoint to get all departments
@app.route('/api/department_details', methods=['GET'])
def get_all_departments():
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM department_details')
        departments = cursor.fetchall()
        conn.close()

        departments_list = []
        for department in departments:
            department_data = {
                "department_details_id": department[0],
                "department_name": department[1],
                "department_type": department[2],
                "department_description": department[3],
                "department_head": department[4],
                "department_email": department[5],
                "department_phone": department[6],
                "department_address": department[7],
                "department_uid": department[8]
            }
            departments_list.append(department_data)

        return jsonify({"status": True, "message": "Departments retrieved successfully", "departments": departments_list}), 200
    except Exception as e:
        return jsonify({"status": False, "message": "Failed to retrieve departments", "error": str(e)}), 500


def get_department_details_id_by_name(department_name):
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        cursor.execute('SELECT department_details_id FROM department_details WHERE department_name = ?', (department_name,))
        row = cursor.fetchone()

        if row:
            department_details_id = row[0]
            conn.close()
            return department_details_id
        else:
            conn.close()
            return None
    except Exception as e:
        print("Error while fetching department_details_id:", e)
        return None


@app.route('/api/register_project', methods=['POST'])
def register_project():
    data = request.get_json()
    print("Received Data:", data)
    project_name = data['project_name']
    department_name = data['department_name']
    project_description = data['project_description']
    project_budget = data['project_budget']
    project_start_date = data['project_start_date']
    project_end_date = data['project_end_date']
    project_status = data['project_status']
    project_location = data['project_location']
    latitude = data['latitude']
    longitude = data['longitude']

    # Check if department_name is empty
    if not department_name:
        return jsonify({"status": False, "message": "Department name cannot be empty"}), 400

    print(data);
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()
        department_details_id = get_department_details_id_by_name(department_name)


        cursor.execute('''
            INSERT INTO project_details (
                project_name,
                department_name,
                project_description,
                project_budget,
                project_start_date,
                project_end_date,
                project_status,
                project_location,
                latitude,
                longitude,
                department_details_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
            project_name,
            department_name,
            project_description,
            project_budget,
            project_start_date,
            project_end_date,
            project_status,
            project_location,
            latitude,
            longitude,
            department_details_id
        ))

        conn.commit()
        conn.close()

        return jsonify({"status": True, "message": "Project registration successful"}), 200
    except Exception as e:
        return jsonify({"status": False, "message": "Project registration failed", "error": str(e)}), 500
    
@app.route('/api/project_details', methods=['GET'])
def get_all_projects():
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM project_details')
        rows = cursor.fetchall()

        projects = []
        for row in rows:
            project = {
                'project_id': row[0],
                'project_name': row[1],
                'department_name': row[2],
                'project_description': row[3],
                'project_budget': row[4],
                'project_start_date': row[5],
                'project_end_date': row[6],
                'project_status': row[7],
                'project_location': row[8],
                'latitude': row[9],
                'longitude': row[10]
            }
            projects.append(project)

        conn.close()
        return jsonify(projects), 200

    except Exception as e:
        return jsonify({"status": False, "message": "Failed to fetch projects", "error": str(e)}), 500
    

# Function to fetch projects of a particular department
def get_projects_by_department(department_name):
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM project_details
            WHERE department_name = ?;
        ''', (department_name,))
        projects = cursor.fetchall()
        conn.close()
        return projects
    except Exception as e:
        print("Error fetching projects:", e)
        return []

# API route to get projects of a particular department
@app.route('/api/dashboard_projects', methods=['GET'])
def dashboard_projects():
    department_name = request.args.get('department_name')

    if not department_name:
        return jsonify({'error': 'Department name is missing.'}), 400

    projects = get_projects_by_department(department_name)

    if not projects:
        return jsonify({'message': 'No projects found for the given department.'}), 404

    project_list = []
    for project in projects:
        project_dict = {
            'project_id': project[0],
            'project_name': project[1],
            'department_name': project[2],
            'project_description': project[3],
            'project_budget': project[4],
            'project_start_date': project[5],
            'project_end_date': project[6],
            'project_status': project[7],
            'project_location': project[8],
            'latitude': project[9],
            'longitude': project[10],
        }
        project_list.append(project_dict)

    return jsonify({'projects': project_list}), 200


# Function to update project_status based on project_end_date
def update_project_status():
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        # Get the current date
        current_date = datetime.now().strftime('%Y-%m-%d')

        # Update project_status based on project_end_date
        update_query = '''
            UPDATE project_details 
            SET project_status = 
                CASE 
                    WHEN project_end_date < ? THEN 'Completed'
                    WHEN project_end_date >= ? THEN 'Ongoing'
                END
        '''
        cursor.execute(update_query, (current_date, current_date))

        conn.commit()
        conn.close()

        return jsonify({"status": True, "message": "Project status updated successfully"}), 200
    except Exception as e:
        return jsonify({"status": False, "message": "Failed to update project status", "error": str(e)}), 500

# API endpoint to update project_status based on project_end_date
@app.route('/api/update_project_status', methods=['GET'])
def api_update_project_status():
    return update_project_status()

# Collaboration Request API endpoint
@app.route('/api/collaboration', methods=['POST'])
def send_collaboration_request():
    data = request.get_json()

    to_department_name = data['to_dept_name']
    from_department_name = data['from_dept_name']
    pid = data['pid']
    subject = data['subject']
    budget = data['budget']
    duration = data['duration']
    content = data['content']

    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS collab_req_details (
                request_id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_dept_id INTEGER,
                from_department_name TEXT,
                to_department_name TEXT,
                project_id INTEGER,
                subject TEXT,
                budget_in_lakh REAL,
                duration DATE,
                content TEXT,
                req_status BOOLEAN DEFAULT 0,
                receiver_dept_id INTEGER,
                posted_on DATE
            )
        ''')

        select1 = "SELECT department_details_id FROM department_details WHERE department_name = ?"
        cursor.execute(select1, (from_department_name,))
        row = cursor.fetchone()

        if row:
            sender_dept_id = row[0]
        else:
            conn.close()
            return jsonify({"status": False, "message": "Sender department not found."}), 404

        select2 = "SELECT department_details_id FROM department_details WHERE department_name = ?"
        cursor.execute(select2, (to_department_name,))
        row = cursor.fetchone()

        if row:
            receiver_dept_id = row[0]
        else:
            conn.close()
            return jsonify({"status": False, "message": "Receiver department not found."}), 404

        insert1 = '''
            INSERT INTO collab_req_details (
                sender_dept_id,
                from_department_name,
                to_department_name,
                project_id,
                subject,
                budget_in_lakh,
                duration,
                content,
                receiver_dept_id,
                posted_on
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))
        '''
        cursor.execute(insert1, (
            sender_dept_id,
            from_department_name,
            to_department_name,
            pid,
            subject,
            budget,
            duration,
            content,
            receiver_dept_id
        ))

        conn.commit()
        conn.close()

        return jsonify({"status": True, "message": "Collaboration request sent successfully"}), 200
    except Exception as e:
        return jsonify({"status": False, "message": "Failed to send collaboration request", "error": str(e)}), 500


# Endpoint to retrieve all collab_req_details
@app.route('/api/collab_req_details', methods=['GET'])
def get_collab_req_details():
    dept_name = request.args.get('dept_name');
    dept_id =  get_department_details_id_by_name(dept_name);
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        select_query = "SELECT * FROM collab_req_details WHERE receiver_dept_id = ? AND req_status = 0 ORDER BY posted_on ASC"
        cursor.execute(select_query, (dept_id,))
        data = cursor.fetchall()

        conn.close()

        collab_req_list = []
        for row in data:
            collab_req = {
                "request_id": row[0],
                "sender_dept_id": row[1],
                "from_department_name": row[2],
                "to_department_name": row[3],
                "project_id": row[4],
                "subject": row[5],
                "budget_in_lakh": row[6],
                "duration": row[7],
                "content": row[8],
                "req_status": row[9],
                "receiver_dept_id": row[10],
                "posted_on": row[11]
            }
            collab_req_list.append(collab_req)

        return jsonify({"status": True, "message": "Collaboration requests retrieved successfully", "collab_reqs": collab_req_list}), 200

    except Exception as e:
        return jsonify({"status": False, "message": "Failed to retrieve collaboration requests", "error": str(e)}), 500


# Endpoint to retrieve all collab_req_details
@app.route('/api/collab_req_history', methods=['GET'])
def get_collab_req_history():
    dept_name = request.args.get('dept_name');
    dept_id =  get_department_details_id_by_name(dept_name);
    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        select_query = "SELECT * FROM collab_req_details WHERE receiver_dept_id = ? AND req_status = 1 ORDER BY posted_on ASC"
        cursor.execute(select_query, (dept_id,))
        data = cursor.fetchall()

        conn.close()

        collab_req_list = []
        for row in data:
            collab_req = {
                "request_id": row[0],
                "sender_dept_id": row[1],
                "from_department_name": row[2],
                "to_department_name": row[3],
                "project_id": row[4],
                "subject": row[5],
                "budget_in_lakh": row[6],
                "duration": row[7],
                "content": row[8],
                "req_status": row[9],
                "receiver_dept_id": row[10],
                "posted_on": row[11]
            }
            collab_req_list.append(collab_req)

        return jsonify({"status": True, "message": "Collaboration requests retrieved successfully", "collab_reqs": collab_req_list}), 200

    except Exception as e:
        return jsonify({"status": False, "message": "Failed to retrieve collaboration requests", "error": str(e)}), 500


# API Endpoint to handle approval of collaboration request
@app.route('/api/collab_req_details/approve', methods=['POST'])
def approve_collab_request():
    data = request.get_json()
    project_id = data.get('project_id')
    request_id = data.get('request_id')

    try:
        # Your database operations for approval go here
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        # Retrieve project details
        select_query = "SELECT * FROM project_details WHERE project_id = ?"
        cursor.execute(select_query, (project_id,))
        project_details = cursor.fetchone()

        if not project_details:
            conn.close()
            return jsonify({"status": False, "message": "Project details not found"}), 404
        
        if project_details:
            department_name = project_details[2]
            project_budget = project_details[4]
            project_end_date = project_details[6]
            
        select_query = "SELECT * FROM collab_req_details WHERE request_id = ?"
        cursor.execute(select_query, (request_id,))
        collab_req = cursor.fetchone()
        
        if not collab_req:
            conn.close()
            return jsonify({"status": False, "message": "Collaboration request details not found"}), 404

        if collab_req :
           from_department_name = collab_req[2]
           duration = collab_req[7]

        # Calculate the new department name and date
        dept_name = from_department_name + " & " + department_name
        new_date = max(duration, project_end_date)

        # Update project details
        update_query = "UPDATE project_details SET department_name = ?, project_end_date = ? WHERE project_id = ?"
        cursor.execute(update_query, (dept_name, new_date, project_id))

        # Update collaboration request status
        update_query = "UPDATE collab_req_details SET req_status = 1 WHERE request_id = ?"
        cursor.execute(update_query, (request_id,))

        # Commit changes and close the connection
        conn.commit()
        conn.close()

        return jsonify({"status": True, "message": "Collaboration request approved successfully"}), 200

    except Exception as e:
        return jsonify({"status": False, "message": "Failed to approve collaboration request", "error": str(e)}), 500


# API Endpoint to handle decline of collaboration request
@app.route('/api/collab_req_details/decline', methods=['DELETE'])
def decline_collab_request():
    request_id = request.args.get('request_id')

    if not request_id:
        return jsonify({"status": False, "message": "Request ID is missing"}), 400

    try:
        conn = sqlite3.connect('deeplink.db')
        cursor = conn.cursor()

        update_query = "UPDATE collab_req_details SET req_status = 1 WHERE request_id = ?"
        cursor.execute(update_query, (request_id,))

        conn.commit()
        conn.close()

        return jsonify({"status": True, "message": "Collaboration request declined successfully"}), 200
    except Exception as e:
        return jsonify({"status": False, "message": "Failed to decline collaboration request", "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    
if __name__ == '__main__':
    app.run()
