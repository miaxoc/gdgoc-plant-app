from app import create_app, scheduler, scheduler2

app = create_app()

if (__name__) == "__main__" :
    scheduler.start()
    scheduler2.start()
    app.run(host='0.0.0.0', port=5000,debug="true",use_reloader=False)