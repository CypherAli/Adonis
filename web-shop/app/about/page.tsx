export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About SHOE STORE</h1>
        
        <div className="prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to SHOE STORE - Your premier destination for premium quality footwear. 
              We've been serving customers with passion and dedication, bringing you the finest 
              selection of shoes from top brands around the world.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to provide not just shoes, but confidence, comfort, and style 
              to every customer who walks through our doors or visits our online store.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Premium quality products from trusted brands</li>
              <li>Competitive prices and regular promotions</li>
              <li>Fast and reliable shipping</li>
              <li>Excellent customer service</li>
              <li>Easy returns and exchanges</li>
              <li>Authentic products guarantee</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-sm text-gray-600">Only the best products make it to our shelves</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">💯</div>
                <h3 className="font-semibold mb-2">Trust</h3>
                <p className="text-sm text-gray-600">100% authentic products guaranteed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Service</h3>
                <p className="text-sm text-gray-600">Customer satisfaction is our priority</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="mb-2"><strong>Hotline:</strong> 084.856.5650</p>
              <p className="mb-2"><strong>Email:</strong> support@shoestore.com</p>
              <p><strong>Hours:</strong> Mon-Sun, 8:00 AM - 10:00 PM</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
