// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import "../../../css/myaccount/edit.css";

const Edit = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        location: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch('https://back-server-1.onrender.com/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setFormData({
                ...formData,
                firstName: data.full_name.split(' ')[0],
                lastName: data.full_name.split(' ')[1],
                email: data.email,
                location: data.location || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, location } = formData;

        try {
            const response = await fetch('https://back-server-1.onrender.com/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    full_name: `${firstName} ${lastName}`,
                    email,
                    location,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully');
            } else {
                alert(`Error updating profile: ${data.error}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    });

    return (
        <div className="card1">
            <header className="header-edit">
                <a className="indx" href="">
                    <svg className="na" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                </a>
                <h1 className="head-edit">Edit Info</h1>
            </header>
            <form method="post" id="addressForm" className="form" onSubmit={handleSave}>
                <div className="row">
                    <div className="fname">
                        <input
                            placeholder="Enter First Name"
                            required
                            className="fN"
                            type="text"
                            value={formData.firstName}
                            id="fN-firstName"
                            name="firstName"
                            onChange={handleChange}
                        />
                        <label className="lbl" htmlFor="fN-firstName">First Name</label>
                    </div>
                    <div className="lname">
                        <input
                            placeholder="Enter Last Name"
                            required
                            className="fN"
                            type="text"
                            value={formData.lastName}
                            id="fN-lastName"
                            name="lastName"
                            onChange={handleChange}
                        />
                        <label className="lbl" htmlFor="fN-lastName">Last Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="lname">
                        <input
                            placeholder="Enter Your Email"
                            required
                            className="fN"
                            type="email"
                            value={formData.email}
                            id="fN-email"
                            name="email"
                            onChange={handleChange}
                        />
                        <label className="lbl" htmlFor="fN-email">Email</label>
                    </div>
                    <div className="wth">
                        <div className="gen-loc">
                            <select
                                required
                                className="location"
                                id="locid"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            >
                                <option value="1356">A.S.K. Showground/Wanye</option>
                                <option value="1189">Adams Arcade / Dagoretti Corner</option>
                                <option value="1201">Bahati / Marish / Viwandani / Jeri</option>
                                <option value="1540">Bomas/CUEA/Galleria</option>
                                <option value="1200">Buruburu / Hamza / Harambee</option>
                                <option value="1169">CBD - GPO/City Market/Nation Centre</option>
                                <option value="1168">CBD - KICC/Parliament/Kencom</option>
                                <option value="1171">CBD - Luthuli/Afya Centre/ R. Ngala</option>
                                <option value="1170">CBD - UON/Globe/Koja/River Road</option>
                                <option value="1545">City Stadium/Makongeni/Mbotela</option>
                                <option value="1486">Embakasi East-Pipeline/Transami/Airport North Rd</option>
                                <option value="998">Embakasi North - Dandora / Kariobangi North</option>
                                <option value="999">Embakasi South - Bunyala Road / South B</option>
                                <option value="1563">Embakasi South - Mombasa Road/Sameer Park/General Motors/ICD</option>
                                <option value="1558">Embakasi South-Landimawe/KwaReuben/Kware/Pipeline</option>
                                <option value="1510">Garden Estate/Thome/Marurui</option>
                                <option value="1541">Gigiri/Village market/UN</option>
                                <option value="1509">Githurai/Kahawa Sukari</option>
                                <option value="1543">Hurlingham/DOD/Yaya center</option>
                                <option value="1202">Huruma / Kiamaiko / Mbatini / Ngei</option>
                                <option value="1478">Imara Daima/AA/Maziwa/Kwa Njenga</option>
                                <option value="1204" selected>Kahawa Wendani/ Kenyatta University</option>
                                <option value="1455">Kahawa west/Githurai 44</option>
                                <option value="1517">Kamukunji - Airbase/Mlango Kubwa</option>
                                <option value="1518">Kamukunji - Eastleigh/California/Shauri Moyo</option>
                                <option value="1564">Kamulu</option>
                                <option value="1007">Karen</option>
                                <option value="1469">Kariobangi South/Dandora/Airbase</option>
                                <option value="1008">Kawangware/Stage 56</option>
                                <option value="1485">Kilimani/State House/Denis Pritt</option>
                                <option value="1474">Kinoo/Zambezi/Ngecha</option>
                                <option value="1473">Kiserian/Corner Baridi/Ongata Rongai</option>
                                <option value="1203">Korogocho / Baraka / Gitathuru / Grogan</option>
                                <option value="1495">Langata/Hardy/Mbagathi</option>
                                <option value="1496">Lavington/Mziima/James Gichuru</option>
                                <option value="1508">Muthaiga/Parklands</option>
                                <option value="1497">Ngara/Pangani</option>
                                <option value="1484">Ngong/Kibiku</option>
                                <option value="1506">Nyayo Highrise/Nairobi West</option>
                                <option value="1519">Roy Sambu/Kasarani</option>
                                <option value="1483">Ruai</option>
                                <option value="1009">Ruiru</option>
                                <option value="1468">Runda/Estate/Muthaiga</option>
                                <option value="1480">Rwaka/Two Rivers</option>
                                <option value="1466">South C</option>
                                <option value="1482">Thindigua/Kasarini</option>
                                <option value="1479">Umoja/Infill</option>
                                <option value="1559">Utawala</option>
                                <option value="1542">Valley Road / Community / Kenyatta Hospital</option>
                                <option value="1552">Waiyaki Way/Kangemi</option>
                                <option value="1172">Westlands</option>
                                <option value="1477">Ziwani/Zimmerman/Githurai 45</option>
                            </select>
                            <label className="lbl" htmlFor="locid">Location</label>
                        </div>
                    </div>
                </div>
                <div className="buttonsave">
                    <div className="divbtn">
                        <button className="btnsave">Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Edit;
