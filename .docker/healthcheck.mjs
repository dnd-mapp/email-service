try {
    const response = await fetch('http://localhost:4350/health/readiness');

    if (!response.ok) {
        console.error(`Status: "${response.status}"`);
        process.exit(1);
    }
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

process.exit(0);
